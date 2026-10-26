const SENSITIVE_PARAM_PARTS = ['key', 'token', 'secret', 'auth', 'password']

// Stops at characters that end a URL embedded in prose, JSON or quoted
// attributes, e.g. ethers' `url="https://..."` or a JSON-escaped `\"`.
const URL_IN_TEXT = /\b(?:https?|wss?):\/\/[^\s"'`<>\\]+/gi
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/

/**
 * Masks the secrets of every URL found in a free-form text, such as an error
 * message from a third-party library that embeds the request URL.
 */
export function redactUrls(text: string): string {
  if (!text.includes('://')) {
    return text
  }
  return text.replace(URL_IN_TEXT, (match) => {
    const trailing = TRAILING_PUNCTUATION.exec(match)?.[0] ?? ''
    const url = match.slice(0, match.length - trailing.length)
    return redactUrl(url) + trailing
  })
}

/**
 * Keeps the URL readable while masking secrets: userinfo, values of sensitive
 * query params and high-entropy path segments (e.g. RPC provider keys baked
 * into the path like `.../v2/<API_KEY>`).
 */
export function redactUrl(url: string): string {
  try {
    const parsed = new URL(url)

    if (parsed.username) {
      parsed.username = 'REDACTED'
    }
    if (parsed.password) {
      parsed.password = 'REDACTED'
    }

    const sensitive = [...parsed.searchParams.keys()].filter((name) =>
      SENSITIVE_PARAM_PARTS.some((part) => name.toLowerCase().includes(part)),
    )
    for (const name of sensitive) {
      parsed.searchParams.set(name, 'REDACTED')
    }

    parsed.pathname = parsed.pathname.split('/').map(sanitizeSegment).join('/')

    return parsed.toString()
  } catch {
    return url
  }
}

function sanitizeSegment(segment: string): string {
  const colon = segment.indexOf(':')
  if (colon !== -1 && colon < segment.length - 1) {
    return `${segment.slice(0, colon)}:REDACTED`
  }
  return isSecretLikeSegment(segment) ? 'REDACTED' : segment
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
    segment.length >= 16 &&
    /^[A-Za-z0-9_-]+$/.test(segment) &&
    /[A-Za-z]/.test(segment) &&
    /[0-9]/.test(segment)
  )
}
