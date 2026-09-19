'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import type { BufferChannel } from '@/contracts/channel';
import { Sidebar } from '@/components/sidebar';

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

async function fetchChannels(): Promise<BufferChannel[]> {
  const response = await fetch('/api/channels');
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch channels');
  }
  return data;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const pathname = usePathname();

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannels,
  });

  const channelMatch = pathname.match(/^\/channel\/([^/]+)/);
  const selectedChannelId = channelMatch ? channelMatch[1] : null;

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        channels={channels}
        selectedChannelId={selectedChannelId}
        isLoading={isLoading}
      />
      <main className="flex-1 bg-white rounded-l-3xl shadow-xl overflow-auto">
        {children}
      </main>
    </div>
  );
}
