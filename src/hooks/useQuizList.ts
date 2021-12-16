import {useApiEndpoint} from "./internal";
import {Quiz} from "../model";

const API_QUIZZES_ENDPOINT = 'https://printful.com/test-quiz.php?action=quizzes';

export function useQuizList() {
    return useApiEndpoint<Quiz[]>(API_QUIZZES_ENDPOINT, []);
}