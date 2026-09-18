import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateCodeChallenge, generateCodeVerifier } from '@/utils/generate-code-verifier';
import { getBaseUrl } from '@/utils/get-base-url';
import { COOKIE_KEYS } from '@/constants';

const BUFFER_AUTH_ENDPOINT = process.env.BUFFER_AUTH_ENDPOINT;
const CLIENT_ID = process.env.BUFFER_CLIENT_ID;

export async function GET(request: Request) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();

  const baseUrl = getBaseUrl(request);

  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_KEYS.CODE_VERIFIER,
    value: codeVerifier,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60,
    sameSite: 'lax',
  });

  cookieStore.set({
    name: COOKIE_KEYS.OAUTH_STATE,
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60,
    sameSite: 'lax',
  });

  const redirectUri = `${baseUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'posts:write posts:read ideas:read ideas:write account:read account:write offline_access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  const authUrl = `${BUFFER_AUTH_ENDPOINT}/auth?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}