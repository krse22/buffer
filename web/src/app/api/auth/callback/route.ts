import { getBufferAccount } from '@/services/buffer.service';
import { getBaseUrl } from '@/utils/get-base-url';
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
    const savedState = cookieStore.get('buffer_state')?.value;
    const verifier = cookieStore.get('buffer_code_verifier')?.value;

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
    const { expires_in, access_token, refresh_token } = tokensResponse;

   
    const account = await getBufferAccount(access_token);
    console.log('ACCOUNT');
    console.log(account);

    cookieStore.set({
        name: 'buffer_token',
        value: access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: expires_in,
        sameSite: 'lax',
    });

    cookieStore.set({
        name: 'buffer_refresh_token',
        value: refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    cookieStore.set({
        name: 'authenticated',
        value: 'true'
    });

    return NextResponse.redirect(new URL('', baseUrl));
}