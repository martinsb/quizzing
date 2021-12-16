import React, {createContext, useContext, useState} from "react";

interface ISettingsContext {
    userName: string;
    quizId: number | undefined;
    setUserName: (name: string) => void;
    setQuizId: (name: number) => void;
}

const defaultState: ISettingsContext = {
    userName: '',
    quizId: undefined,
    //stub implementations
    setUserName: () => {},
    setQuizId:() => {},
};

const SettingsContext = createContext<ISettingsContext>(defaultState);

interface SettingsProviderProps {
    children?: React.ReactNode,
    value: ISettingsContext,
}

export const SettingsProvider = ({children, value}: SettingsProviderProps) => {
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext<ISettingsContext>(SettingsContext);