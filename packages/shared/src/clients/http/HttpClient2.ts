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
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(init.timeout ?? 10_000),
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`)
    }

    return (await res.json()) as json
  }
}
