/**
 * The headers a provider states its limit in. Logged with a refusal, they
 * say how long to wait and often what the limit is, which no amount of
 * counting our own calls shows.
 */
const RATE_LIMIT_HEADER =
  /^(retry-after|(x-)?rate-?limit-(limit|remaining|reset|policy))$/i
/** The provider writes these values and they end up in our logs. */
const MAX_VALUE_LENGTH = 64

export type RateLimitHeaders = Record<string, string>

/** The rate-limit headers of a response, by lowercase name; empty when it has none. */
export function readRateLimitHeaders(headers: Headers): RateLimitHeaders {
  const found: RateLimitHeaders = {}
  headers.forEach((value, name) => {
    if (RATE_LIMIT_HEADER.test(name)) {
      found[name.toLowerCase()] = value.slice(0, MAX_VALUE_LENGTH)
    }
  })
  return found
}

/** The rate-limit headers a thrown HTTP error carries in its cause, if any. */
export function readRateLimit(error: unknown): RateLimitHeaders | undefined {
  if (!(error instanceof Error) || !isRecord(error.cause)) {
    return undefined
  }
  const { rateLimit } = error.cause
  if (!isRecord(rateLimit)) {
    return undefined
  }
  return Object.fromEntries(
    Object.entries(rateLimit).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
