
/**
 * Represents the organization return from Buffer's GraphQL API.
 */
export type Organization = {
  id: string;
  name: string;
  owner: string;
}

/**
 * Represents the core user details returned from Buffer's GraphQL API.
 */
export type BufferAccount = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  organizations: Array<Organization>;
};
