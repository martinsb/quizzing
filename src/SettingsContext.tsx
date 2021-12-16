import React, {createContext, useContext, useState} from "react";

interface ISettingsContext {
    userName: string;
    quizId: number | undefined;
    setUserName?: (name: string) => void;
    setQuizId?: (name: number) => void;
}

const defaultState: ISettingsContext = {
    userName: '',
    quizId: undefined,
};

const SettingsContext = createContext<ISettingsContext>(defaultState);

interface SettingsProviderProps {
    children?: React.ReactNode,
}

export const SettingsProvider = ({children}: SettingsProviderProps) => {
    const [userName, setUserName] = useState(defaultState.userName);
    const [quizId, setQuizId] = useState<number | undefined>(defaultState.quizId);
    return (
        <SettingsContext.Provider value={{
            userName, quizId, setUserName, setQuizId,
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext<ISettingsContext>(SettingsContext);