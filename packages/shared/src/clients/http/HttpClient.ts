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

/**
 * Keeps the URL readable while masking secrets: values of sensitive query
 * params and high-entropy path segments (e.g. RPC provider keys baked into the
 * path like `.../v2/<API_KEY>`).
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)

    const sensitive = [...parsed.searchParams.keys()].filter((name) =>
      SENSITIVE_PARAMS.includes(name.toLowerCase()),
    )
    for (const name of sensitive) {
      parsed.searchParams.set(name, 'REDACTED')
    }

    parsed.pathname = parsed.pathname
      .split('/')
      .map((segment) => (isSecretLikeSegment(segment) ? 'REDACTED' : segment))
      .join('/')

    return parsed.toString()
  } catch {
    return url
  }
}

/**
 * Heuristic for path segments that look like API keys/tokens. Public blockchain
 * identifiers (0x-prefixed hashes and addresses) are never secrets, so they are
 * left intact; everything else that is long and mixes letters with digits is
 * treated as a secret and redacted.
 */
function isSecretLikeSegment(segment: string): boolean {
  if (segment.startsWith('0x')) {
    return false
  }
  return (
    segment.length >= 24 &&
    /^[A-Za-z0-9_-]+$/.test(segment) &&
    /[A-Za-z]/.test(segment) &&
    /[0-9]/.test(segment)
  )
}
