import type { json } from '@l2beat/shared-pure'
import { type FetchInit, fetchWithTimeout } from './fetchWithTimeout'
import { sanitizeUrl } from './sanitizeUrl'

export { sanitizeUrl }

export class HttpClient {
  /**
   * Sends request to the provided url with init params.
   * Use this method only when you expect server to return valid JSON.
   * Default timeout is 10_000ms
   */
  async fetch(url: string, init: FetchInit): Promise<json> {
    const res = await fetchWithTimeout(url, init)

    if (!res.ok) {
      // Release the socket back to the pool instead of leaving it pinned
      await res.body?.cancel()
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`, {
        cause: {
          url: sanitizeUrl(url),
        },
      })
    }

    return (await res.json()) as json
  }

  async fetchRaw(url: string, init: FetchInit) {
    return await fetchWithTimeout(url, init)
  }
}
