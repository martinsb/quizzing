import React from 'react';
import {useHomeForm, useQuizList} from "./hooks";

interface HomePageProps {
    onContinue: (name: string, quizId: number) => void;
}

export const HomePage = ({onContinue}: HomePageProps) => {
    //TODO handle loading and loadError
    const {loading, error: loadError, data: quizzes} = useQuizList();

    const {nameInputRef, quizSelectRef, handleSubmit, errors: formErrors} = useHomeForm(onContinue);

    return (
        <>
            <h1>{'Technical task'}</h1>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={loading}>
                    {formErrors.name && <p>{formErrors.name}</p>}
                    <input ref={nameInputRef} type="text" placeholder={'Enter your name'} />
                    <br/>
                    {formErrors.quiz && <p>{formErrors.quiz}</p>}
                    <select ref={quizSelectRef} aria-busy={loading}>
                        <option key={''} value="">{'Choose test'}</option>
                        {quizzes?.map(({id, title}) => (
                            <option key={id} value={id}>{title}</option>
                        ))}
                    </select>
                    <br />
                    <input type="submit" value="Start" />
                </fieldset>
            </form>
        </>
    );
};