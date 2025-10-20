import { ApiError } from './apiError';
import { Error400Code } from './error-400.enum';

export interface Error400 extends ApiError {
    code: Error400Code;
}
