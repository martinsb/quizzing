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
import {Answer, Question, Quiz, Results} from "./model";

const API_QUIZZES_ENDPOINT = 'https://printful.com/test-quiz.php?action=quizzes';
const API_QUESTIONS_ENDPOINT = 'https://printful.com/test-quiz.php?action=questions&quizId=:quizId:';
const API_ANSWERS_ENDPOINT = 'https://printful.com/test-quiz.php?action=answers&quizId=:quizId:&questionId=:questionId:';
const API_SUBMIT_ENDPOINT = 'https://printful.com/test-quiz.php?action=submit&quizId=:quizId:&:answers:' //answers[]=57737&answers[]=262891


async function retrieveData<T>(url: string,
                               initialData: T,
                               setLoading: (value: boolean) => void,
                               setError: (value: string) => void,
                               setData: (value: T) => void) {
    setLoading(true);
    setError('');
    setData(initialData);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Invalid response from API')
        }
        setData(await response.json() as T);
    } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error fetching data');
    } finally {
        setLoading(false);
    }
}

function useApiEndpoint<T>(url: string, initialData: T) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<T>(initialData);
    useEffect(() => {
        retrieveData(url, initialData, setLoading, setError, setData);
    }, [url]);
    return {
        loading,
        error,
        data,
    }
}

export function useQuizList() {
    return useApiEndpoint<Quiz[]>(API_QUIZZES_ENDPOINT, []);
}

type QuizState = {
    finished: boolean;
    questions: Question[];
    answers: Answer[];
    responses: number[];
    questionIndex: number;
};
type QuizAction =
| {type: 'clear'}
| {type: 'questions-loaded', payload: {questions: Question[]}}
| {type: 'answers-loaded', payload: {answers: Answer[]}}
| {type: 'submit-response'}
| {type: 'respond-question', payload: {answerId: number}};

const initialState: QuizState = {
    finished: false,
    questions: [],
    answers: [],
    responses: [],
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
                responses: [],
            };
        }
        case 'answers-loaded': {
            return {
                ...state,
                answers: action.payload.answers,
            };
        }
        case 'submit-response': {
            const nextIndex = state.questionIndex + 1;
            return {
                ...state,
                questionIndex: nextIndex < state.questions.length ? nextIndex : (state.questions.length - 1),
                finished: nextIndex === state.questions.length,
            };
        }
        case 'respond-question': {
            const {answers} = state;
            if (!answers.find(({id}) => id === action.payload.answerId)) {
                //sanity check, should never happen
                throw new Error('Invalid answer ID');
            }
            const responses = [...state.responses];
            responses[state.questionIndex] = action.payload.answerId;
            return {
                ...state,
                responses,
            };
        }
    }
    return state;
}

export function useCurrentQuestion(quizId: number, onFinish: (responses: number[]) => void) {
    const [state, dispatch] = useReducer(questionsReducer, initialState);
    const {finished, questions, questionIndex, answers, responses} = state;
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [loadingAnswers, setLoadingAnswers] = useState(false);
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
    const submitResponse = useCallback(() => {
        dispatch({
            type: 'submit-response',
        });
    }, [dispatch]);
    const respondQuestion = useCallback((answerId: number) => {
        dispatch({
            type: 'respond-question',
            payload: {
                answerId,
            },
        })
    }, [dispatch]);

    useEffect(() => {
        const url = API_QUESTIONS_ENDPOINT.replace(':quizId:', '' + quizId);
        retrieveData(url, [], setLoadingQuestions, setError, setQuestions);
    }, [quizId, setQuestions]);
    useEffect(() => {
        if (questions.length === 0) {
            return;
        }
        const url = API_ANSWERS_ENDPOINT
            .replace(':quizId:','' + quizId)
            .replace(':questionId:', '' + questions[questionIndex].id);
        retrieveData(url, [], setLoadingAnswers, setError, setAnswers);
    }, [quizId, questions, questionIndex, setAnswers]);

    useEffect(() => {
        if (finished) {
            onFinish(responses)
        }
    }, [responses, finished, onFinish]);

    return {
        loadingQuestions,
        loadingAnswers,
        error,
        questionTitle: questions[questionIndex]?.title ?? '',
        answers,
        progress: questions.length > 0 ? (questionIndex / questions.length * 100) : 0,
        submitResponse,
        respondQuestion,
        currentResponse: responses[questionIndex] !== undefined ? responses[questionIndex] : undefined,
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

export function useResults(quizId: number, responses: number[]) {
    const url = API_SUBMIT_ENDPOINT.replace(':quizId', '' + quizId).replace(':answers:', responses.map(id => 'answers[]=' + id).join('&'));
    return useApiEndpoint<Results | undefined>(url, undefined);
}
