import fetch, { type RequestInit } from 'node-fetch'

export class HttpClient {
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
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`, {
        cause: {
          url: sanitizeUrl(url),
        },
      })
    }

    return res.json()
  }

  async fetchRaw(url: string, init: RequestInit & { timeout?: number }) {
    return await fetch(url, {
      ...init,
      timeout: init.timeout ?? 10_000,
    })
  }
}

const SENSITIVE_PARAMS = [
  'key',
  'apikey',
  'api_key',
  'token',
  'access_token',
  'auth',
  'secret',
  'password',
]

/** Keeps the URL readable while masking secret query param values. */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const sensitive = [...parsed.searchParams.keys()].filter((name) =>
      SENSITIVE_PARAMS.includes(name.toLowerCase()),
    )
    for (const name of sensitive) {
      parsed.searchParams.set(name, 'REDACTED')
    }
    return parsed.toString()
  } catch {
    return url
  }
}
