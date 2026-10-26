const SENSITIVE_PARAM_PARTS = ['key', 'token', 'secret', 'auth', 'password']

// Stops at characters that end a URL embedded in prose, JSON or quoted
// attributes, e.g. ethers' `url="https://..."` or a JSON-escaped `\"`.
const URL_IN_TEXT = /\b(?:https?|wss?):\/\/[^\s"'`<>\\]+/gi
const TRAILING_PUNCTUATION = '.,;:!?)]}'

/**
 * Masks the secrets of every URL found in a free-form text, such as an error
 * message from a third-party library that embeds the request URL.
 */
export function redactUrls(text: string): string {
  if (!text.includes('://')) {
    return text
  }
  return text.replace(URL_IN_TEXT, (match) => {
    let end = match.length
    while (end > 0 && TRAILING_PUNCTUATION.includes(match[end - 1] ?? '')) {
      end--
    }
    // An IPv6 host ends with `]`, and without it the URL does not parse
    if (match[end] === ']' && !canParse(match.slice(0, end))) {
      end++
    }
    return redactUrl(match.slice(0, end)) + match.slice(end)
  })
}

function canParse(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
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
    return redactUnparsableUrl(url)
  }
}

// Without a parser we cannot tell secrets from the rest, so only the scheme
// and host survive
function redactUnparsableUrl(url: string): string {
  const match = /^([a-z][a-z0-9+.-]*:\/\/)([^/?#]*)(.*)$/is.exec(url)
  if (!match) {
    return url
  }
  const [, scheme = '', authority = '', rest = ''] = match
  const at = authority.lastIndexOf('@')
  const host = at === -1 ? authority : `REDACTED@${authority.slice(at + 1)}`
  return `${scheme}${host}${rest ? '/REDACTED' : ''}`
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
