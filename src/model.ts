export type AppState = 'quizzes' | 'test' | 'results';

export interface Quiz {
    id: number;
    title: string;
}

export interface Question {
    id: number;
    title: string;
}

export interface QuestionWithAnswers extends Question {
    answers: Answer[];
}

export interface Answer {
    id: number;
    title: string;
}
