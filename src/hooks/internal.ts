import {useEffect, useState} from "react";

export async function retrieveData<T>(url: string,
                                      initialData: T,
                                      setLoading: (value: boolean) => void,
                                      setError: (value: string) => void,
                                      setData: (value: T) => void) {
    setLoading(true);
    setError('');
    setData(initialData);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Invalid response from API')
        }
        setData(await response.json() as T);
    } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error fetching data');
    } finally {
        setLoading(false);
    }
}

export function useApiEndpoint<T>(url: string, initialData: T) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<T>(initialData);
    useEffect(() => {
        retrieveData(url, initialData, setLoading, setError, setData);
    }, [url]);
    return {
        loading,
        error,
        data,
    }
}