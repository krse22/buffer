import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiErrorResponse, BufferErrorNonRec, NetworkError, NonRecoverableError, UnauthorizedError } from '@/contracts/errors';
import { COOKIE_KEYS } from '@/constants';

const BUFFER_API_ENDPOINT = process.env.BUFFER_API_ENDPOINT;
const BUFFER_AUTH_ENDPOINT = process.env.BUFFER_AUTH_ENDPOINT;
const CLIENT_ID = process.env.BUFFER_CLIENT_ID;

type TokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
};

/**
 * Attempts to refresh the access token using the refresh token.
 * Updates cookies with new tokens on success.
 *
 * @returns {Promise<string | null>} - The new access token, or null if refresh failed.
 */
async function refreshAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${BUFFER_AUTH_ENDPOINT}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID ?? '',
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (response.status != 200) {
            return null;
        }

        const tokens: TokenResponse = await response.json();

        cookieStore.set({
            name: COOKIE_KEYS.ACCESS_TOKEN,
            value: tokens.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: tokens.expires_in,
            sameSite: 'lax',
        });

        cookieStore.set({
            name: COOKIE_KEYS.REFRESH_TOKEN,
            value: tokens.refresh_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        });

        return tokens.access_token;
    } catch {
        return null;
    }
}

/**
 * Clears all authentication cookies.
 *
 * @returns {Promise<void>}
 */
async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
    cookieStore.delete(COOKIE_KEYS.ORGANIZATION_ID);
    cookieStore.delete(COOKIE_KEYS.AUTHENTICATED);
}

/**
 * Executes a GraphQL query against the Buffer API.
 *
 * @param {string} query - The GraphQL query string
 * @returns {Promise<T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError>} The data from the API response
 */
async function executeBufferQuery<T>(query: string): Promise<T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

    try {
        const response = await fetch(`${BUFFER_API_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                return new UnauthorizedError('Authentication failed');
            }

            return new Error(`Buffer API failed with status: ${response.status}`);
        }

        const { data, errors }: { data: T, errors: Array<NonRecoverableError> | undefined } = await response.json();
        if (errors) {
            return new BufferErrorNonRec(errors[0]);
        }

        return data;
    } catch {
        return new NetworkError('Failed to connect to Buffer API');
    }
}

/**
 * Attempts to refresh the token and retry the query.
 * Clears auth cookies if refresh fails.
 *
 * @param {string} query - The GraphQL query to retry
 * @returns {Promise<T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError>} The retry result or UnauthorizedError
 */
async function refreshAndRetry<T>(query: string): Promise<T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError> {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
        await clearAuthCookies();
        return new UnauthorizedError('Token refresh failed');
    }

    return await executeBufferQuery<T>(query);
}

/**
 * Unified Buffer API handler that manages authentication and token refresh.
 *
 * - Executes the provided GraphQL query against Buffer API
 * - Handles HTTP 401 by attempting token refresh and retrying
 * - Handles GraphQL UNAUTHORIZED error by attempting token refresh and retrying
 * - Clears auth cookies and returns UnauthorizedError if refresh fails
 * - Returns other non-recoverable errors as BufferErrorNonRec
 * - Returns NetworkError on network failures
 *
 * @param {string} query - The GraphQL query to execute
 * @returns {Promise<T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError>} The query result or an error
 */
export async function bufferApi<T>(query: string): Promise<T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError> {
    const result = await executeBufferQuery<T>(query);

    // HTTP 401 - attempt refresh and retry
    if (result instanceof UnauthorizedError) {
        return await refreshAndRetry<T>(query);
    }

    // GraphQL UNAUTHORIZED error - attempt refresh and retry
    if (result instanceof BufferErrorNonRec && result.error.extensions.code === 'UNAUTHORIZED') {
        return await refreshAndRetry<T>(query);
    }

    return result;
}

/**
 * Extracts error data from various error types into a unified format.
 *
 * @param {Error | UnauthorizedError | BufferErrorNonRec | NetworkError} error - The error to extract
 * @returns {ApiErrorResponse} Unified error response for frontend
 */
export function extractError(error: Error): ApiErrorResponse {
    if (error instanceof UnauthorizedError) {
        return { type: 'unauthorized', message: error.message };
    }

    if (error instanceof NetworkError) {
        return { type: 'network', message: error.message };
    }

    if (error instanceof BufferErrorNonRec) {
        return {
            type: 'buffer_api',
            message: error.error.message,
            code: error.error.extensions.code,
        };
    }

    return { type: 'unknown', message: error.message };
}

/**
 * Creates a NextResponse based on the bufferApi result.
 * Use this in API routes for consistent error handling.
 *
 * @param {T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError} result - The result from bufferApi
 * @returns {NextResponse} JSON response with appropriate status code
 */
export function toNextResponse<T>(result: T | Error | UnauthorizedError | BufferErrorNonRec | NetworkError): NextResponse {
    if (result instanceof UnauthorizedError) {
        return NextResponse.json({ error: extractError(result) }, { status: 401 });
    }

    if (result instanceof NetworkError) {
        return NextResponse.json({ error: extractError(result) }, { status: 503 });
    }

    if (result instanceof BufferErrorNonRec) {
        return NextResponse.json({ error: extractError(result) }, { status: 500 });
    }

    if (result instanceof Error) {
        return NextResponse.json({ error: extractError(result) }, { status: 500 });
    }

    return NextResponse.json(result);
}
