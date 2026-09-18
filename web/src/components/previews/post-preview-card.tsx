'use client';

import Link from 'next/link';
import type { Post } from '@/contracts/post';
import { Image, Video, FileText } from 'lucide-react';

type PostPreviewCardProps = {
  post: Post;
  channelId: string;
};

export function PostPreviewCard({ post, channelId }: PostPreviewCardProps) {
  const wordCount = post.text ? post.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const imageCount = post.assets.filter(a => a.type === 'image').length;
  const videoCount = post.assets.filter(a => a.type === 'video').length;
  const truncatedText = post.text?.length > 100 ? post.text.slice(0, 100) + '...' : post.text;

  return (
    <Link
      href={`/channel/${channelId}/posts/${post.id}`}
      className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {post.assets.length > 0 && (
        <div className="flex gap-1 flex-shrink-0">
          {post.assets.slice(0, 4).map((asset) => (
            <img
              key={asset.id}
              src={asset.thumbnail || asset.source}
              alt=""
              className="w-12 h-12 object-cover rounded"
            />
          ))}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 line-clamp-2">{truncatedText || 'No text'}</p>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {wordCount} words
          </span>

          {imageCount > 0 && (
            <span className="flex items-center gap-1">
              <Image className="w-3 h-3" />
              {imageCount}
            </span>
          )}

          {videoCount > 0 && (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              {videoCount}
            </span>
          )}

          <span className="text-gray-400">{post.status}</span>

          {post.dueAt && (
            <span className="ml-auto text-gray-400">
              {new Date(post.dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
