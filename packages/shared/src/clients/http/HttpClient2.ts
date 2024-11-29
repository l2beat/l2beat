import { json } from '@l2beat/shared-pure'

export class HttpClient2 {
  /**
   * Sends request to the provided url with init params.
   * Use this method only when you expect server to return valid JSON.
   * Default timeout is 10_000ms
   */
  async fetch(
    url: string,
    init: RequestInit & { timeout?: number },
  ): Promise<json> {
    const timeout = init.timeout ?? 10000
    const baseUrl = getBaseUrl(url)

    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeout),
      })

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status} at ${baseUrl}`)
      }

      return (await res.json()) as json
    } catch (error) {
      if ((error as Error).name === 'TimeoutError') {
        throw new Error(`Timeout at ${baseUrl} after ${timeout}ms`)
      }
      throw error
    }
  }
}

function getBaseUrl(url: string) {
  const baseUrl = url.match(/^(https?:\/\/[^\/]+)/)?.[1]
  return baseUrl ? baseUrl : 'NON_HTTP_URL'
}
