import {FormEvent, useCallback, useRef, useState} from "react";

type Field = 'name' | 'quiz';

type FieldErrors = {
    [key in Field]?: string;
}

export function useHomeForm(onSubmitted: (name: string, quizId: number) => void) {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const quizSelectRef = useRef<HTMLSelectElement>(null);
    const [formErrors, setFormErrors] = useState<FieldErrors>({});
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors: FieldErrors = {};
        const name = nameInputRef.current!.value.trim();
        if (!name) {
            errors['name'] = 'Please input your name';
        }

        const quizId = parseInt(quizSelectRef.current!.value, 10);
        if (isNaN(quizId)) {
            errors['quiz'] = 'Please select your test';
        }
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            onSubmitted(name, quizId);
        }
    }, [setFormErrors, onSubmitted]);
    return {
        nameInputRef,
        quizSelectRef,
        errors: formErrors,
        handleSubmit,
    };
}