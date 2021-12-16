import {useApiEndpoint} from "./internal";
import {Results} from "../model";

const API_SUBMIT_ENDPOINT = 'https://printful.com/test-quiz.php?action=submit&quizId=:quizId:&:answers:' //answers[]=57737&answers[]=262891
export function useResults(quizId: number, responses: number[]) {
    const url = API_SUBMIT_ENDPOINT.replace(':quizId', '' + quizId).replace(':answers:', responses.map(id => 'answers[]=' + id).join('&'));
    return useApiEndpoint<Results | undefined>(url, undefined);
}