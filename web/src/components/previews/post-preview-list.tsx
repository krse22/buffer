'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PostsConnection } from '@/contracts/post';
import { PostPreviewCard } from './post-preview-card';
import { PostPreviewListSkeleton } from './post-preview-skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PostPreviewListProps = {
  channelId: string;
};

async function fetchPosts(channelId: string, after?: string): Promise<PostsConnection> {
  const params = new URLSearchParams({ channelId });
  if (after) params.set('after', after);

  const response = await fetch(`/api/posts?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch posts');
  }

  return data;
}

export function PostPreviewList({ channelId }: PostPreviewListProps) {
  const [cursors, setCursors] = useState<string[]>([]);
  const currentCursor = cursors[cursors.length - 1];

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', channelId, currentCursor],
    queryFn: () => fetchPosts(channelId, currentCursor),
  });

  function handleNext() {
    if (data?.pageInfo.endCursor) {
      setCursors(prev => [...prev, data.pageInfo.endCursor!]);
    }
  }

  function handlePrev() {
    setCursors(prev => prev.slice(0, -1));
  }

  if (isLoading) {
    return <PostPreviewListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 text-sm">{error.message}</div>
    );
  }

  if (!data || data.edges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">No posts found</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.edges.map((edge) => (
        <PostPreviewCard key={edge.node.id} post={edge.node} channelId={channelId} />
      ))}

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={cursors.length === 0}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!data.pageInfo.hasNextPage}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
