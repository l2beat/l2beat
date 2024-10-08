import fetch, { RequestInit } from 'node-fetch'

export class HttpClient2 {
  constructor(private readonly defaultTimeoutMs = 10_000) {}

  async fetchJson(url: string, init?: RequestInit): Promise<unknown> {
    const res = await fetch(url, {
      ...init,
      timeout: init?.timeout ?? this.defaultTimeoutMs,
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`HTTP error: ${res.status} ${res.statusText} ${body}`)
    }

    return res.json() as unknown
  }
}
