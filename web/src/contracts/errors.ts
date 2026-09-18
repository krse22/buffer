/**
 * Represents a type of non recoverable error returned from Buffer API
 */
export type BufferErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'UNEXPECTED' | 'RATE_LIMIT_EXCEEDED';

/**
 * Represents a structure for a Non-recoverable errors from buffers API
 * non-recoverable errors are system level errors.
 *
 * Examples: UNAUTHORIZED, FORBIDDEN, NOT_FOUND, UNEXPECTED, RATE_LIMIT_EXCEEDED
 */
export type NonRecoverableError = {
    message: string;
    path: Array<string>;
    extensions: {
        code: BufferErrorCode;
    }
}

/**
 * Represents an Error extended with data from Buffer Non-Recoverable error
 */
export class BufferErrorNonRec extends Error {
    error: NonRecoverableError;

    constructor(error: NonRecoverableError) {
        super(error.message);
        this.error = error;
    }
}

/**
 * Represents an unauthorized error when no valid access token is available
 * and token refresh has failed or refresh token is missing.
 */
export class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Represents a network error when fetch fails due to network issues.
 */
export class NetworkError extends Error {
    constructor(message = 'Network request failed') {
        super(message);
        this.name = 'NetworkError';
    }
}

/**
 * Error response structure for frontend consumption.
 */
export type ApiErrorResponse = {
    type: 'unauthorized' | 'network' | 'buffer_api' | 'unknown';
    message: string;
    code?: BufferErrorCode;
};