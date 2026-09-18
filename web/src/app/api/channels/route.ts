import { getBufferChannels } from '@/services/buffer.service';
import { toNextResponse } from '@/utils/api-handler';

export async function GET() {
  const result = await getBufferChannels();
  return toNextResponse(result);
}
