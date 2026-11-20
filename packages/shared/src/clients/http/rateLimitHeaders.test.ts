import type { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import {
  readRateLimit,
  readRateLimitHeaders,
  StatedRateLimitLog,
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

  // Why: names seen in a survey of the RPCs we track (Nov 2026). Ronin and
  // gateway.fm split limits per window or per client, HashKey states its
  // quota in its own header, and zkfair sends the caller's IP under a
  // similar name, which must stay out of our logs
  it('keeps the variants providers use, not just the bare names', () => {
    const headers = new Headers({
      'X-RateLimit-Limit-Minute': '100',
      'X-RateLimit-Remaining-Ip': '0',
      'X-RateLimit-Window': '1',
      'X-Rpc-Limit-Quota': '150',
      'X-Rpc-Limit-Method': 'eth_blockNumber',
      'X-Rate-Limit-Request-Forwarded-For': '1.2.3.4',
    })

    expect(readRateLimitHeaders(headers)).toEqual({
      'x-ratelimit-limit-minute': '100',
      'x-ratelimit-remaining-ip': '0',
      'x-ratelimit-window': '1',
      'x-rpc-limit-quota': '150',
      'x-rpc-limit-method': 'eth_blockNumber',
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

describe(StatedRateLimitLog.name, () => {
  // Why: some providers state their limit on every answer, so it can be
  // known before the first refusal. Logged once per change, not per call,
  // since only the remaining count moves from call to call
  it('logs the stated limit once, and again when it changes', () => {
    const logger = mockObject<Logger>({ info: () => {} })
    const log = new StatedRateLimitLog(logger, 300)

    log.observe(
      new Headers({ 'X-RateLimit-Limit': '30', 'X-RateLimit-Remaining': '29' }),
    )
    log.observe(
      new Headers({ 'X-RateLimit-Limit': '30', 'X-RateLimit-Remaining': '28' }),
    )
    log.observe(
      new Headers({ 'X-RateLimit-Limit': '60', 'X-RateLimit-Remaining': '59' }),
    )

    expect(logger.info).toHaveBeenCalledTimes(2)
    expect(logger.info).toHaveBeenNthCalledWith(
      1,
      'Provider states its rate limit',
      {
        rateLimit: { 'x-ratelimit-limit': '30', 'x-ratelimit-remaining': '29' },
        callsPerMinute: 300,
      },
    )
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      'Provider states its rate limit',
      {
        rateLimit: { 'x-ratelimit-limit': '60', 'x-ratelimit-remaining': '59' },
        callsPerMinute: 300,
      },
    )
  })

  it('logs nothing when no limit is stated', () => {
    const logger = mockObject<Logger>({ info: () => {} })
    const log = new StatedRateLimitLog(logger, 300)

    log.observe(
      new Headers({ 'Retry-After': '1', 'X-RateLimit-Remaining': '0' }),
    )

    expect(logger.info).not.toHaveBeenCalled()
  })
})
