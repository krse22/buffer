import { cookies } from "next/headers";
import { BufferAccount } from "@/contracts/account";
import { BufferChannel } from "@/contracts/channel";
import { BufferErrorNonRec, UnauthorizedError } from "@/contracts/errors";
import { bufferApi } from "@/utils/api-handler";
import { COOKIE_KEYS } from "@/constants";

/**
 * Fetches the authenticated user's account details from Buffer's GraphQL API.
 * Uses the unified bufferApi which handles token refresh automatically.
 *
 * @returns {Promise<BufferAccount | Error | UnauthorizedError | BufferErrorNonRec>} The account details or an error.
 */
export async function getBufferAccount(): Promise<BufferAccount | Error | UnauthorizedError | BufferErrorNonRec> {
  const GET_ACCOUNT_QUERY = `
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

  const result = await bufferApi<{ account: BufferAccount }>(GET_ACCOUNT_QUERY);

  if (result instanceof Error) {
    return result;
  }

  return result.account;
}

/**
 * Fetches all connected channels for the organization from Buffer's GraphQL API.
 * Uses the unified bufferApi which handles token refresh automatically.
 * Reads organization ID from the buffer_organization_id cookie.
 *
 * @returns {Promise<BufferChannel[] | Error | UnauthorizedError | BufferErrorNonRec>} An array of channel objects or an error.
 */
export async function getBufferChannels(): Promise<BufferChannel[] | Error | UnauthorizedError | BufferErrorNonRec> {
  const cookieStore = await cookies();
  const organizationId = cookieStore.get(COOKIE_KEYS.ORGANIZATION_ID)?.value;

  console.log(organizationId);

  const query = `
    query GetChannels {
      channels(input: {
        organizationId: "${organizationId}"
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

  const result = await bufferApi<{ channels: BufferChannel[] }>(query);

  if (result instanceof Error) {
    return result;
  }

  return result.channels;
}
