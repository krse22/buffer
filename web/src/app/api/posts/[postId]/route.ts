import { NextRequest } from 'next/server';
import { getBufferPost } from '@/services/buffer.service';
import { toNextResponse } from '@/utils/api-handler';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const result = await getBufferPost(postId);
  return toNextResponse(result);
}
