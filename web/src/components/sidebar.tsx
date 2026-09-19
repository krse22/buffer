'use client';

import type { BufferChannel } from '@/contracts/channel';
import { ChannelList } from '@/components/channel-list';
import { LogoutButton } from '@/components/logout-button';

type SidebarProps = {
  channels: BufferChannel[];
  selectedChannelId: string | null;
  isLoading?: boolean;
};

function ChannelSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-10 h-10 bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
        <div className="h-3 bg-gray-700 rounded w-16" />
      </div>
    </div>
  );
}

export function Sidebar({ channels, selectedChannelId, isLoading }: SidebarProps) {
  return (
    <aside className="w-72 bg-gray-900 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Buffer Gaze</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          Channels
        </div>
        {isLoading ? (
          <div className="space-y-1">
            <ChannelSkeleton />
            <ChannelSkeleton />
            <ChannelSkeleton />
          </div>
        ) : (
          <ChannelList
            channels={channels}
            selectedId={selectedChannelId}
          />
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <LogoutButton fullWidth />
      </div>
    </aside>
  );
}
