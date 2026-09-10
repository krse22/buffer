/**
 * Generates a cryptographically secure, URL-safe random string to act as a 
 * PKCE (Proof Key for Code Exchange) code verifier.
 * 
 * @returns A 43-character URL-safe random string (Base64URL encoded).
 * 
 * @example
 * const verifier = generateCodeVerifier();
 * Pass this verifier to your PKCE challenge generator and store it in sessionStorage
 */
export function generateCodeVerifier() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder()
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(verifier))
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
