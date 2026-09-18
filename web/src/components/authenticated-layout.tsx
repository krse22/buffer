'use client';

import { useEffect, useState } from 'react';
import type { BufferChannel } from '@/contracts/channel';
import { Sidebar } from '@/components/sidebar';
import { PostPreviewList } from '@/components/previews/post-preview-list';

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [channels, setChannels] = useState<BufferChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch('/api/channels');
        if (response.ok) {
          const data = await response.json();
          setChannels(data);
          if (data.length > 0) {
            setSelectedChannelId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
  }, []);

  const handleChannelSelect = (channel: BufferChannel) => {
    setSelectedChannelId(channel.id);
  };

  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        channels={channels}
        selectedChannelId={selectedChannelId}
        onChannelSelect={handleChannelSelect}
      />
      <main className="flex-1 bg-white rounded-l-3xl shadow-xl overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : selectedChannelId ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {selectedChannel?.avatar && (
                <img
                  src={selectedChannel.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedChannel?.displayName || selectedChannel?.name}
              </h1>
            </div>
            <PostPreviewList channelId={selectedChannelId} />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
