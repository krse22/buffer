/**
 * Resolves the base URL from the request.
 * Uses request.url directly, with special handling for ngrok tunnels.
 * 
 * @param {Request} - Next's request object
 * @returns {string} - Resolved url
 */
export function getBaseUrl(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (forwardedHost?.includes('ngrok')) {
    const proto = request.headers.get('x-forwarded-proto') || 'https'
    return `${proto}://${forwardedHost}`
  }

  return new URL(request.url).origin
}