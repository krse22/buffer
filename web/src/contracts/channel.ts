/**
 * Social network service types supported by Buffer.
 */
export type Service =
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'googlebusiness'
  | 'mastodon'
  | 'threads'
  | 'bluesky'
  | 'startpage';

/**
 * Represents a connected social media channel from Buffer's GraphQL API.
 */
export type BufferChannel = {
  id: string;
  name: string;
  displayName: string | null;
  avatar: string;
  service: Service;
  descriptor: string;
  isDisconnected: boolean;
};
