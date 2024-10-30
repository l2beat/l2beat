import fetch, { RequestInit } from 'node-fetch'

export class HttpClient2 {
  /**
   * Sends request to the provided url with init params.
   * Use this method only when you expect server to return valid JSON.
   * Default timeout is 10_000ms
   */
  async fetch(url: string, init: RequestInit) {
    const res = await fetch(url, {
      ...init,
      timeout: init.timeout ?? 10_000,
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }

    return res.json()
  }
}
