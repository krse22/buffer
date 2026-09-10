/**
 * Represents the core user details returned from Buffer's GraphQL API.
 */
export type BufferAccount = {
  id: string;
  email: string;
  name: string;
  avatar: string;
};