import { BufferErrorNonRec } from '@/contracts/errors';
import { getBufferChannels } from '@/services/buffer.service';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('buffer_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await getBufferChannels(accessToken);
  if (response instanceof BufferErrorNonRec) {
    return NextResponse.json({ error: response.error }, { status: 500 });
  }

  if (response instanceof Error) {
    return NextResponse.json({ error: response.message }, { status: 500 });
  }

  return NextResponse.json(response);
}
