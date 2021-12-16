import React from 'react';
import {useSettings} from "./SettingsContext";
import {useResults} from "./hooks";

interface ResultsPageProps {
    responses: number[],
}

export const ResultsPage = ({responses}: ResultsPageProps) => {
    const {userName, quizId} = useSettings();
    const {loading, error, data: results} = useResults(quizId!, responses);
    return (
        <div>
            <h1>{`Thanks ${userName}!`}</h1>
            {results && <p>{`You responded correctly to ${results.correct} of ${results.total} questions.`}</p>}
        </div>
    );
}
