export type BufferErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'UNEXPECTED' | 'RATE_LIMIT_EXCEEDED';

/**
 * Represents a structure for a Nnn-recoverable errors from buffers API
 * non-recoverable errors are system level errors.
 * 
 * Examples: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, UNEXPECTED, RATE_LIMIT_EXCEEDED
 */
export type NonRecoverableError = {
    message: "Not authorized";
    path: Array<string>;
    extensions: {
        code: BufferErrorCode;
    }
}

/**
 * Represents an Error extended with data from Buffer Non-Recoverable error
 */
export class BufferErrorNonRec extends Error{
    error: NonRecoverableError;

    constructor(error: NonRecoverableError) {
        super(error.message);
        this.error = error;
    }
}