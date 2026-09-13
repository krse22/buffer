'use client';

import type { BufferChannel } from '@/contracts/channel';
import { ChannelList } from '@/components/channel-list';
import { LogoutButton } from '@/components/logout-button';

type SidebarProps = {
  channels: BufferChannel[];
  selectedChannelId: string | null;
  onChannelSelect: (channel: BufferChannel) => void;
};

export function Sidebar({ channels, selectedChannelId, onChannelSelect }: SidebarProps) {
  return (
    <aside className="w-72 bg-gray-900 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Buffer</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          Channels
        </div>
        <ChannelList
          channels={channels}
          selectedId={selectedChannelId}
          onSelect={onChannelSelect}
        />
      </div>

      <div className="p-4 border-t border-gray-800">
        <LogoutButton fullWidth />
      </div>
    </aside>
  );
}
