import { ApiError } from './apiError';
import { Error404Code } from './error-404.enum';

export interface Error404 extends ApiError {
    code: Error404Code;
}
