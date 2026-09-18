/**
 * Asset types for post media.
 */
export type AssetType = 'document' | 'image' | 'video';

/**
 * Represents a media asset attached to a post.
 */
export type Asset = {
  id: string;
  mimeType: string;
  source: string;
  thumbnail: string;
  type: AssetType;
};

/**
 * Represents a post from Buffer's GraphQL API.
 */
export type Post = {
  id: string;
  dueAt: string;
  status: string;
  asset: Asset | null;
};

/**
 * Represents pagination info for posts.
 */
export type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
};

/**
 * Represents a post edge in the connection.
 */
export type PostEdge = {
  cursor: string;
  node: Post;
};

/**
 * Represents the posts connection response.
 */
export type PostsConnection = {
  edges: PostEdge[];
  pageInfo: PageInfo;
};
