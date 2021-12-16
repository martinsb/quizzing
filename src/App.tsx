import React, {useCallback, useState} from 'react';
import './App.css';
import {HomePage} from "./HomePage";
import {SettingsProvider} from "./SettingsContext";
import {AppState} from "./model";
import {QuizPage} from "./QuizPage";
import {ResultsPage} from "./ResultsPage";

function App() {
    const [responses, setResponses] = useState<number[]>([]);
    const [appState, setAppState] = useState<AppState>('quizzes');
    const [userName, setUserName] = useState('');
    const [quizId, setQuizId] = useState<number | undefined>(undefined);
    const openTest = useCallback((name: string, quizId: number) => {
        setUserName(name);
        setQuizId(quizId);
        setAppState('test');
    }, [setUserName, setQuizId, setAppState]);
    const openResults = useCallback((responses: number[]) => {
        setResponses(responses);
        setAppState('results');
    }, []);
    return (
      <SettingsProvider value={{userName, setUserName, quizId, setQuizId}}>
          <div className="App">
              {appState === 'quizzes' && <HomePage onContinue={openTest} />}
              {appState === 'test' && quizId && <QuizPage quizId={quizId} onFinish={openResults} />}
              {appState === 'results' && <ResultsPage responses={responses} />}
          </div>
      </SettingsProvider>
    );
}

export default App;
