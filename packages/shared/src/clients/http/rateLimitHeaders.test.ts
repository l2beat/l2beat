import { expect } from 'earl'
import {
  readRateLimitHeaders,
  readRetryAfterMs,
  readThrottling,
} from './rateLimitHeaders'

describe(readRateLimitHeaders.name, () => {
  // Why: these values are written by the provider and end up in our logs,
  // so only the headers that state a limit are kept, and none at length
  it('keeps the headers that state a limit, by lowercase name', () => {
    const headers = new Headers({
      'Retry-After': '10',
      'X-RateLimit-Limit': '200',
      'RateLimit-Remaining': '0',
      'X-RateLimit-Note': 'not a limit',
      'Content-Type': 'application/json',
      'X-RateLimit-Policy': 'p'.repeat(200),
    })

    expect(readRateLimitHeaders(headers)).toEqual({
      'retry-after': '10',
      'x-ratelimit-limit': '200',
      'ratelimit-remaining': '0',
      'x-ratelimit-policy': 'p'.repeat(64),
    })
  })

  it('returns nothing for a response without them', () => {
    expect(readRateLimitHeaders(new Headers({ Server: 'nginx' }))).toEqual({})
  })
})

describe(readRetryAfterMs.name, () => {
  const now = Date.UTC(2026, 10, 19, 10, 30)

  it('reads seconds, whole or not', () => {
    expect(readRetryAfterMs('10', now)).toEqual(10_000)
    expect(readRetryAfterMs('1.5', now)).toEqual(1_500)
  })

  it('reads an HTTP date as the time left until it', () => {
    expect(readRetryAfterMs('Thu, 19 Nov 2026 10:30:20 GMT', now)).toEqual(
      20_000,
    )
    expect(readRetryAfterMs('Thu, 19 Nov 2026 10:00:00 GMT', now)).toEqual(0)
  })

  // Why: `Date.parse` reads a past date with something trailing it as that
  // date, which would turn a wait into none
  it('reads nothing from a value that is neither', () => {
    expect(readRetryAfterMs('soon', now)).toEqual(undefined)
    expect(readRetryAfterMs('Thu, 01 Jan 2026 00:00:00 GMT, 120', now)).toEqual(
      undefined,
    )
    expect(readRetryAfterMs(null, now)).toEqual(undefined)
  })
})

describe(readThrottling.name, () => {
  it('reads the wait from a refusal for the rate', () => {
    const error = new Error('HTTP error: 429 Too Many Requests', {
      cause: { status: 429, rateLimit: { 'retry-after': '5' } },
    })

    expect(readThrottling(error)).toEqual({ retryAfterMs: 5_000 })
  })

  it('reads a refusal that names no wait', () => {
    const error = new Error('HTTP error: 429 Too Many Requests', {
      cause: { status: 429 },
    })

    expect(readThrottling(error)).toEqual({ retryAfterMs: undefined })
  })

  it('reads nothing from any other error', () => {
    expect(
      readThrottling(new Error('HTTP error', { cause: { status: 503 } })),
    ).toEqual(undefined)
    expect(readThrottling(new Error('HTTP timeout'))).toEqual(undefined)
    expect(readThrottling('429')).toEqual(undefined)
  })
})
