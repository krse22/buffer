'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Post } from '@/contracts/post';
import { ArrowLeft, Image, Video, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

type PostPageProps = {
  params: Promise<{ channelId: string; postId: string }>;
};

async function fetchPost(postId: string): Promise<Post> {
  const response = await fetch(`/api/posts/${postId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch post');
  }
  return data;
}

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-24 mb-6" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="flex gap-2 mt-6">
        <div className="w-32 h-32 bg-gray-200 rounded" />
        <div className="w-32 h-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function PostPage({ params }: PostPageProps) {
  const { channelId, postId } = use(params);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
  });

  const wordCount = post?.text ? post.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const imageCount = post?.assets.filter(a => a.type === 'image').length ?? 0;
  const videoCount = post?.assets.filter(a => a.type === 'video').length ?? 0;

  return (
    <div className="p-6 max-w-3xl">
      <Link
        href={`/channel/${channelId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to channel
      </Link>

      {isLoading ? (
        <PostSkeleton />
      ) : error ? (
        <div className="text-red-500">{error.message}</div>
      ) : post ? (
        <div>
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{post.status}</span>
            {post.dueAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.dueAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>

          <p className="text-gray-900 whitespace-pre-wrap mb-6">{post.text || 'No text'}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {wordCount} words
            </span>
            {imageCount > 0 && (
              <span className="flex items-center gap-1">
                <Image className="w-4 h-4" />
                {imageCount} images
              </span>
            )}
            {videoCount > 0 && (
              <span className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                {videoCount} videos
              </span>
            )}
          </div>

          {post.assets.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {post.assets.map((asset) => (
                <div key={asset.id} className="aspect-square">
                  {asset.type === 'video' ? (
                    <video
                      src={asset.source}
                      poster={asset.thumbnail}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={asset.thumbnail || asset.source}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
