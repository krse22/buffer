import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/utils/get-base-url';
import { COOKIE_KEYS } from '@/constants';

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request);

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
  cookieStore.delete(COOKIE_KEYS.ORGANIZATION_ID);
  cookieStore.delete(COOKIE_KEYS.AUTHENTICATED);

  return NextResponse.redirect(baseUrl);
}
