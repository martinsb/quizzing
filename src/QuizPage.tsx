import React, {useCallback} from 'react';
import {useCurrentQuestion} from "./hooks";

interface QuizPageProps {
    quizId: number;
    onFinish: (responses: number[]) => void;
}

export const QuizPage = ({quizId, onFinish}: QuizPageProps) => {
    const {
        loading,
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
            <h1>{questionTitle}</h1>
            {answers.length > 0 &&
                <ul>
                    {answers.map(({id, title}) => (
                        <li key={id}>
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
            }
            <progress max="100" value={progress} />
            <button onClick={submitResponse} disabled={!currentResponse}>{'Next question'}</button>
        </div>
    );
};