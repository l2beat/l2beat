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

/**
 * How long a `Retry-After` asks to wait: a number of seconds, or an HTTP
 * date. Undefined when the header is absent or says neither.
 */
export function readRetryAfterMs(
  value: string | null | undefined,
  now = Date.now(),
): number | undefined {
  if (value === null || value === undefined) {
    return undefined
  }
  if (/^\d+(\.\d+)?$/.test(value.trim())) {
    return Number(value) * 1000
  }
  // `Date.parse` takes loose forms and ignores what trails a date
  const date = HTTP_DATE.test(value.trim()) ? Date.parse(value) : Number.NaN
  return Number.isNaN(date) ? undefined : Math.max(0, date - now)
}

/** `Thu, 19 Nov 2026 10:31:00 GMT`, the form RFC 9110 has servers send */
const HTTP_DATE =
  /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/

/**
 * What a thrown HTTP error says about a refusal for the rate: how long to
 * wait when the provider said, an empty object when it did not, and
 * undefined when the error is not a 429 at all.
 */
export function readThrottling(
  error: unknown,
): { retryAfterMs?: number } | undefined {
  if (!(error instanceof Error) || !isRecord(error.cause)) {
    return undefined
  }
  const { status, rateLimit } = error.cause
  if (status !== 429) {
    return undefined
  }
  const retryAfter = isRecord(rateLimit) ? rateLimit['retry-after'] : undefined
  return {
    retryAfterMs: readRetryAfterMs(
      typeof retryAfter === 'string' ? retryAfter : undefined,
    ),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
