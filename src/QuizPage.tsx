import React from 'react';
import {useCurrentQuestion} from "./hooks";
import {Answer, Question} from "./model";

interface QuizPageProps {
    quizId: number;
}

interface State {
    questions: Question[];
    currentAnswers: Answer[];

    questionIndex: number;
    questionTitle: string;
}

export const QuizPage = ({quizId}: QuizPageProps) => {
    const {
        loading,
        error,
        questionTitle,
        answers
    } = useCurrentQuestion(quizId);

    console.log({questionTitle, answers});

    return (
        <div>
            <h1>{'Quiz'}</h1>
        </div>
    );
};