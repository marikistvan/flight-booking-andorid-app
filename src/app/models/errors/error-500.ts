import { ApiError } from "./apiError";
import { Error500Code } from "./error-500.enum";

export interface Error500 extends ApiError {
    code: Error500Code;
}