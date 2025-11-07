/**
 * Builds a URL with properly encoded query parameters.
 *
 * @param path - The base path for the URL
 * @param params - An object containing key-value pairs for query parameters
 * @returns A URL string with properly encoded query parameters
 *
 * @example
 * ```tsx
 * buildUrlWithParams('/tokens/new', { tab: 'deployed', id: 'abc-123' })
 * // Returns: '/tokens/new?tab=deployed&id=abc-123'
 * ```
 */
export function buildUrlWithParams(
  path: string,
  params: Record<string, string | undefined>,
): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value)
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `${path}?${queryString}` : path
}
