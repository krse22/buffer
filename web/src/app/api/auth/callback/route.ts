import { getBufferAccount } from '@/services/buffer.service';
import { getBaseUrl } from '@/utils/get-base-url';
import { COOKIE_KEYS } from '@/constants';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BUFFER_AUTH_ENDPOINT = process.env.BUFFER_AUTH_ENDPOINT;
const CLIENT_ID = process.env.BUFFER_CLIENT_ID;

export async function GET(request: Request) {
    const url = new URL(request.url);

    const baseUrl = getBaseUrl(request);

    const error = url.searchParams.get('error');
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state');

    const cookieStore = await cookies();
    const savedState = cookieStore.get(COOKIE_KEYS.OAUTH_STATE)?.value;
    const verifier = cookieStore.get(COOKIE_KEYS.CODE_VERIFIER)?.value;

    if (error) {
        return NextResponse.redirect(new URL(`/error?reason=${error}`, baseUrl));
    }

    if (!returnedState || returnedState !== savedState) {
        return NextResponse.redirect(new URL('/error?reason=invalid_state', baseUrl));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/error?reason=missing_code', baseUrl));
    }

    if (!verifier) {
        return NextResponse.redirect(new URL('/error?reason=verifier_not_issued', baseUrl));
    }

    const response = await fetch(`${BUFFER_AUTH_ENDPOINT}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID ?? '',
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${baseUrl}/api/auth/callback`,
            code_verifier: verifier,
        }),
    });

    if (response.status != 200) {
        const { error, error_description }: { error: string, error_description: string } = await response.json();
        return NextResponse.redirect(new URL(`/error?reason=${error}&description=${error_description}`, baseUrl));
    }

    const tokensResponse: { access_token: string, refresh_token: string; expires_in: number } = await response.json();
    const { access_token, refresh_token } = tokensResponse;

    // Set token cookies FIRST so bufferApi can read them
    cookieStore.set({
        name: COOKIE_KEYS.ACCESS_TOKEN,
        value: access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    cookieStore.set({
        name: COOKIE_KEYS.REFRESH_TOKEN,
        value: refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    cookieStore.set({
        name: COOKIE_KEYS.AUTHENTICATED,
        value: 'true',
    });

    // Fetch account details (uses bufferApi which reads from cookies)
    const account = await getBufferAccount();

    if (account instanceof Error) {
        return NextResponse.redirect(new URL('/error?reason=account_fetch_failed', baseUrl));
    }

    cookieStore.set({
        name: COOKIE_KEYS.ORGANIZATION_ID,
        value: account.organizations[0].id,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    return NextResponse.redirect(new URL('', baseUrl));
}
