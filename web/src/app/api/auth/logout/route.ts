import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/utils/get-base-url';

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request);

  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('authenticated');

  return NextResponse.redirect(baseUrl);
}