import React, {useCallback} from 'react';
import {Spinner} from "./components/Spinner";
import {useCurrentQuestion} from "./hooks";

interface QuizPageProps {
    quizId: number;
    onFinish: (responses: number[]) => void;
}

export const QuizPage = ({quizId, onFinish}: QuizPageProps) => {
    const {
        loadingQuestions,
        loadingAnswers,
        error,
        questionTitle,
        answers,
        submitResponse,
        progress,
        respondQuestion,
        currentResponse,
    } = useCurrentQuestion(quizId, onFinish);

    return (
        <div>
            {loadingQuestions && <Spinner />}
            <h2>{questionTitle}</h2>
            {loadingAnswers && <Spinner />}
            {answers.length > 0 && (
                <ul className="QuizPage-answers">
                    {answers.map(({id, title}) => (
                        <li key={id} className="QuizPage-answer">
                            <input type="radio"
                                   value={id}
                                   checked={currentResponse === id}
                                   onChange={() => respondQuestion(id)}
                                   name={'answer'}
                                   id={`answer-${id}`}
                            />
                            <label htmlFor={`answer-${id}`}>{title}</label>
                        </li>
                    ))}
                </ul>
            )}
            <progress max="100" value={progress} />
            <button onClick={submitResponse} disabled={!currentResponse}>{'Next question'}</button>
        </div>
    );
};