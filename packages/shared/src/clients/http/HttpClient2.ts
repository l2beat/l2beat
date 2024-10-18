import fetch, { RequestInit } from 'node-fetch'

export class HttpClient2 {
  constructor(private timeoutMs: number) {}

  static RPC_BLOCK = new HttpClient2(5_000)

  /**
   * Sends request to the provided url with init params.
   * Use this method only when you expect server to return valid JSON.
   */
  async fetch(url: string, init?: RequestInit) {
    const res = await fetch(url, {
      ...init,
      timeout: this.timeoutMs,
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }

    return res.json()
  }
}
