import { BufferAccount } from "@/contracts/account";
import { BufferChannel } from "@/contracts/channel";
import { BufferErrorNonRec, NonRecoverableError } from "@/contracts/errors";

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
        organizations {
          id
          name
          ownerEmail
        }
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

/**
 * Fetches all connected channels for the organization from Buffer's GraphQL API.
 *
 * @param {string} accessToken - The secure Opaque token provided by Buffer after OAuth login.
 * @returns {Promise<BufferChannel[] | Error>} An array of channel objects or an error.
 */
export async function getBufferChannels(accessToken: string): Promise<BufferChannel[] | Error> {
  const query = `
    query GetChannels {
      channels(input: {
          organizationId: "some_organization_id"
      }) {
        id
        name
        displayName
        avatar
        service
        descriptor
        isDisconnected
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

  const { data, errors }: { data: any, errors: Array<NonRecoverableError> | undefined } = await response.json();
  if (errors) {
    return new BufferErrorNonRec(errors[0]);
  }

  return data.channels;
}