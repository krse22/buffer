'use client';

import { useEffect, useState } from 'react';
import type { PostEdge, PageInfo } from '@/contracts/post';
import { PostPreviewCard } from './post-preview-card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

type PostPreviewListProps = {
  channelId: string;
};

export function PostPreviewList({ channelId }: PostPreviewListProps) {
  const [posts, setPosts] = useState<PostEdge[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursors, setCursors] = useState<string[]>([]);

  async function fetchPosts(after?: string) {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ channelId });
      if (after) params.set('after', after);

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || 'Failed to fetch posts');
        return;
      }

      setPosts(data.edges);
      setPageInfo(data.pageInfo);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCursors([]);
    fetchPosts();
  }, [channelId]);

  function handleNext() {
    if (pageInfo?.endCursor) {
      setCursors(prev => [...prev, pageInfo.endCursor!]);
      fetchPosts(pageInfo.endCursor);
    }
  }

  function handlePrev() {
    const newCursors = [...cursors];
    newCursors.pop();
    setCursors(newCursors);
    fetchPosts(newCursors[newCursors.length - 1]);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 text-sm">{error}</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">No posts found</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((edge) => (
        <PostPreviewCard key={edge.node.id} post={edge.node} />
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
          disabled={!pageInfo?.hasNextPage}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
