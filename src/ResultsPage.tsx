import React from 'react';
import {useSettings} from "./SettingsContext";
import {useResults} from "./hooks";

interface ResultsPageProps {
    responses: number[],
}

export const ResultsPage = ({responses}: ResultsPageProps) => {
    const {userName, quizId} = useSettings();
    const {loading, error, data: results} = useResults(quizId!, responses); //quizId should always be defined here
    return (
        <div>
            <h1>{`Thanks ${userName}!`}</h1>
            {loading && (
                <>
                    <p>Loading results of your quiz, please wait.</p>
                    <progress />
                </>
            )}
            {results && <p>{`You responded correctly to ${results.correct} of ${results.total} questions.`}</p>}
        </div>
    );
}
