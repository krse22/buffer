'use client';

import type { BufferChannel } from '@/contracts/channel';
import { getPlatformInfo, PlatformIcon } from '@/utils/platform-icons';

type ChannelListProps = {
  channels: BufferChannel[];
  selectedId: string | null;
  onSelect: (channel: BufferChannel) => void;
};

export function ChannelList({ channels, selectedId, onSelect }: ChannelListProps) {
  return (
    <div className="flex flex-col gap-1">
      {channels.map((channel) => {
        const isSelected = channel.id === selectedId;
        const { name: platformName } = getPlatformInfo(channel.service);
        const displayName = channel.displayName || channel.name;

        return (
          <button
            key={channel.id}
            onClick={() => onSelect(channel)}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
              ${isSelected
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
              ${channel.isDisconnected ? 'opacity-50' : ''}
            `}
          >
            <img
              src={channel.avatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{displayName}</div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <PlatformIcon service={channel.service} className="w-3.5 h-3.5" />
                <span>{platformName}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
