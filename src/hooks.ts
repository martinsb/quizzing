import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState
} from "react";
import {Answer, Question, Quiz} from "./model";

const API_QUIZZES_ENDPOINT = 'https://printful.com/test-quiz.php?action=quizzes';
const API_QUESTIONS_ENDPOINT = 'https://printful.com/test-quiz.php?action=questions&quizId=:quizId:';
const API_ANSWERS_ENDPOINT = 'https://printful.com/test-quiz.php?action=answers&quizId=:quizId:&questionId=:questionId:';


async function retrieveData<T>(url: string,
                               setLoading: (value: boolean) => void,
                               setError: (value: string) => void,
                               setData: (value: T[]) => void) {
    setLoading(true);
    setError('');
    setData([]);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Invalid response from API')
        }
        setData(await response.json() as T[]);
    } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error fetching data');
    } finally {
        setLoading(false);
    }
}

function useApiEndpoint<T>(url: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<T[]>([]);
    useEffect(() => {
        retrieveData(url, setLoading, setError, setData);
    }, [url]);
    return {
        loading,
        error,
        data,
    }
}

export function useQuizList() {
    return useApiEndpoint<Quiz>(API_QUIZZES_ENDPOINT);
}

type QuizState = {
    questions: Question[];
    answers: Answer[];
    questionIndex: number;
};
type QuizAction =
| {type: 'clear'}
| {type: 'questions-loaded', payload: {questions: Question[]}}
| {type: 'answers-loaded', payload: {answers: Answer[]}}
| {type: 'next-question'};

const initialState: QuizState = {
    questions: [],
    answers: [],
    questionIndex: 0,
}

const questionsReducer = (state: QuizState, action: QuizAction) => {
    switch (action.type) {
        case 'clear': {
            return {
                ...initialState,
            };
        }
        case 'questions-loaded': {
            return {
                ...state,
                questions: action.payload.questions,
                answers: [],
            };
        }
    }
    return state;
}
export function useCurrentQuestion(quizId: number) {
    const [state, dispatch] = useReducer(questionsReducer, initialState);
    const {questions, questionIndex, answers} = state;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setQuestions = useCallback((value: Question[]) => {
        dispatch({
            type: 'questions-loaded',
            payload: {
                questions: value,
            },
        });
    }, [dispatch]);
    const setAnswers = useCallback((value: Answer[]) => {
        dispatch({
            type: 'answers-loaded',
            payload: {
                answers: value,
            }
        });
    }, [dispatch]);
    useEffect(() => {
        const url = API_QUESTIONS_ENDPOINT.replace(':quizId:', '' + quizId);
        retrieveData(url, setLoading, setError, setQuestions);
    }, [quizId, setQuestions]);
    useEffect(() => {
        if (questions.length === 0) {
            return;
        }
        const url = API_ANSWERS_ENDPOINT
            .replace(':quizId:','' + quizId)
            .replace(':questionId:', '' + questions[questionIndex].id);
        retrieveData(url, setLoading, setError, setAnswers);
    }, [quizId, questions, questionIndex, setAnswers]);

    return {
        loading,
        error,
        questionTitle: questions[questionIndex]?.title ?? '',
        answers,
    };
}


type Field = 'name' | 'quiz';
type FieldErrors = {
    [key in Field]?: string;
}

export function useHomeForm(onSubmitted: (name: string, quizId: number) => void) {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const quizSelectRef = useRef<HTMLSelectElement>(null);
    const [formErrors, setFormErrors] = useState<FieldErrors>({});
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors: FieldErrors = {};
        const name = nameInputRef.current!.value.trim();
        if (!name) {
            errors['name'] = 'Please input your name';
        }

        const quizId = parseInt(quizSelectRef.current!.value, 10);
        if (isNaN(quizId)) {
            errors['quiz'] = 'Please select your test';
        }
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            onSubmitted(name, quizId);
        }
    }, [setFormErrors, onSubmitted]);
    return {
        nameInputRef,
        quizSelectRef,
        errors: formErrors,
        handleSubmit,
    };
}
