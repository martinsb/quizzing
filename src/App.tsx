import React, {useCallback, useState} from 'react';
import './App.css';
import {HomePage} from "./HomePage";
import {SettingsProvider, useSettings} from "./SettingsContext";
import {AppState} from "./model";
import {QuizPage} from "./QuizPage";

function App() {
    const [appState, setAppState] = useState<AppState>('quizzes');
    const {setUserName, setQuizId, quizId} = useSettings();
    const openTest = useCallback((name: string, quizId: number) => {
        setUserName && setUserName(name);
        setQuizId && setQuizId(quizId);
        setAppState('test');
    }, [setUserName, setQuizId, setAppState]);
    return (
      <SettingsProvider>
          <div className="App">
              {appState === 'quizzes' && <HomePage onContinue={openTest} />}
              {appState === 'test' && quizId && <QuizPage quizId={quizId} />}
          </div>
      </SettingsProvider>
    );
}

export default App;
