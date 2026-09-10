import { BufferAccount } from "@/contracts/account";

const BUFFER_API_ENDPOINT = process.env.BUFFER_API_ENDPOINT;

/**
 * Fetches the authenticated user's account details from Buffer's GraphQL API.
 *
 * @param {string} accessToken - The secure Opaque token provided by Buffer after OAuth login.
 * @returns {Promise<BufferAccount>} An object containing the user's id, email, name, and avatar URL.
 * @throws {Error} Throws an error if the HTTP request fails or if GraphQL returns query errors.
 */
export async function getBufferAccount(accessToken: string): Promise<BufferAccount | Error> {
  const query = `
    query GetAccountDetails {
      account {
        id
        email
        name
        avatar
      }
    }
  `;

  const response = await fetch(`${BUFFER_API_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    return new Error(`Buffer API failed with status: ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    return new Error('Failed to fetch account details');
  }

  return data.account; 
}