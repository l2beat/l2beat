import { expect } from 'earl'
import { readRateLimit, readRateLimitHeaders } from './rateLimitHeaders'

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

describe(readRateLimit.name, () => {
  it('reads the headers an HTTP error carries', () => {
    const error = new Error('HTTP error: 429 Too Many Requests', {
      cause: {
        status: 429,
        rateLimit: { 'retry-after': '5', 'x-ratelimit-limit': '200' },
      },
    })

    expect(readRateLimit(error)).toEqual({
      'retry-after': '5',
      'x-ratelimit-limit': '200',
    })
  })

  it('reads nothing from an error without them', () => {
    expect(
      readRateLimit(new Error('HTTP error', { cause: { status: 429 } })),
    ).toEqual(undefined)
    expect(readRateLimit(new Error('HTTP timeout'))).toEqual(undefined)
  })
})
