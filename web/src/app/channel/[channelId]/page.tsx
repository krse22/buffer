'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BufferChannel } from '@/contracts/channel';
import { PostPreviewList } from '@/components/previews/post-preview-list';

type ChannelPageProps = {
  params: Promise<{ channelId: string }>;
};

async function fetchChannels(): Promise<BufferChannel[]> {
  const response = await fetch('/api/channels');
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch channels');
  }
  return data;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = use(params);

  const { data: channels = [] } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannels,
  });

  const channel = channels.find(c => c.id === channelId);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {channel?.avatar && (
          <img
            src={channel.avatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
        )}
        <h1 className="text-xl font-semibold text-gray-900">
          {channel?.displayName || channel?.name || 'Channel'}
        </h1>
      </div>
      <PostPreviewList channelId={channelId} />
    </div>
  );
}
