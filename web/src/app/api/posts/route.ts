import { getBufferPosts } from '@/services/buffer.service';
import { toNextResponse } from '@/utils/api-handler';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelId = searchParams.get('channelId');
  const after = searchParams.get('after') ?? undefined;

  if (!channelId) {
    return toNextResponse(new Error('channelId is required'));
  }

  const result = await getBufferPosts(channelId, after);
  return toNextResponse(result);
}
