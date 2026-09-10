
/**
 * Retrieves the value of a specific cookie by its name from the browser.
 * Safely returns `null` if executed on the server (e.g., during Next.js SSR).
 *
 * @param {string} name - The exact name of the cookie you want to retrieve.
 * @returns {string | null} The value of the cookie if it exists, otherwise `null`.
 *
 * @example
 * If document.cookie is "theme=dark; is_logged_in=true"
 * const status = getCookie('is_logged_in'); // Returns "true"
 */
export function getCookie(name: string) {
  if (typeof document === 'undefined') return null; 
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}