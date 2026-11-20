import type { Logger } from '@l2beat/backend-tools'

/**
 * The headers a provider states its limit in. They say how long to wait
 * and often what the limit is, which no amount of counting our own calls
 * shows.
 */
const RATE_LIMIT_HEADER =
  /^(retry-after|(x-)?rate-?limit-(limit|remaining|reset|policy|window|duration)(-[a-z0-9]+)?|x-rpc-limit-(quota|count|method))$/i
/**
 * The subset that states the limit itself, not how much of it is left. It
 * stays the same from call to call, so a change in it is worth a log line.
 */
const STATED_LIMIT_HEADER =
  /^((x-)?rate-?limit-(limit|policy|window|duration)(-[a-z0-9]+)?|x-rpc-limit-quota)$/i
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

/**
 * Logs the limit a provider states on its responses, once and again when it
 * changes. Some providers state it on every answer, so we learn the limit
 * before the first refusal, next to the rate we configured.
 */
export class StatedRateLimitLog {
  private lastLogged: string | undefined

  constructor(
    private readonly logger: Logger,
    private readonly callsPerMinute: number,
  ) {}

  observe(headers: Headers): void {
    const rateLimit = readRateLimitHeaders(headers)
    const stated = Object.entries(rateLimit).filter(([name]) =>
      STATED_LIMIT_HEADER.test(name),
    )
    if (stated.length === 0) {
      return
    }
    const key = JSON.stringify(stated)
    if (key === this.lastLogged) {
      return
    }
    this.lastLogged = key
    this.logger.info('Provider states its rate limit', {
      rateLimit,
      callsPerMinute: this.callsPerMinute,
    })
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
