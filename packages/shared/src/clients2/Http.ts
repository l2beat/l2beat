import { Logger, RateLimiter } from '@l2beat/backend-tools'
import fetch, { Headers, type RequestInit } from 'node-fetch'

export interface HttpOptions {
  timeoutMs: number
  maxCallsPerMinute: number
  metricsEnabled: boolean
  metricsFlushIntervalMs: number
  logger: Logger
}

export interface HttpRequestInit extends RequestInit {
  metricsLabel: string
}

export interface HttpResponse {
  body: string
  /** status is between 200 and 299 inclusive */
  ok: boolean
  status: number
  // Ideally it's Record<string, string>, but converting is unnecessary overhead
  // since realistically nobody even uses the headers
  headers: Headers
}

interface Metrics {
  durationTotal: number
  sizeTotal: number
  count: number
}

export class Http {
  private timeoutMs: number
  private rateLimiter?: RateLimiter
  private metrics: Record<string, Metrics> = {}
  private metricsEnabled = false
  private logger: Logger = Logger.SILENT

  constructor(options?: Partial<HttpOptions>) {
    this.timeoutMs = options?.timeoutMs ?? 10_000
    if (options?.maxCallsPerMinute !== undefined) {
      this.rateLimiter = new RateLimiter({
        callsPerMinute: options.maxCallsPerMinute,
      })
    }
    if (options?.metricsEnabled !== undefined) {
      this.metricsEnabled = options.metricsEnabled
    }
    if (options?.logger) {
      this.logger = options.logger
    }

    if (this.metricsEnabled) {
      const interval = setInterval(
        () => this._flushMetrics(),
        options?.metricsFlushIntervalMs ?? 30_000,
      )
      // object will not require the Node.js event loop to remain active
      // nodejs.org/api/timers.html#timers_timeout_unref
      interval.unref()
    }
  }

  async fetch(
    url: string,
    { metricsLabel, ...rest }: HttpRequestInit,
  ): Promise<HttpResponse> {
    const init: RequestInit = { timeout: this.timeoutMs, ...rest }
    if (this.rateLimiter) {
      return await this.rateLimiter.call(() =>
        this._fetch(url, init, metricsLabel),
      )
    }
    return await this._fetch(url, init, metricsLabel)
  }

  private async _fetch(
    url: string,
    init: RequestInit,
    metricsLabel: string,
  ): Promise<HttpResponse> {
    const start = Date.now()
    const res = await fetch(url, init)
    // We need to await text because we don't know if someone wants json or not
    // and we need to actually consume the response body not just the headers
    const body = await res.text()
    this._trackMetrics(metricsLabel, Date.now() - start, res.size)
    return {
      body,
      ok: res.ok,
      status: res.status,
      headers: res.headers,
    }
  }

  private _trackMetrics(
    metricsLabel: string,
    durationMs: number,
    size: number,
  ) {
    if (!this.metricsEnabled) return
    const metrics = this.metrics[metricsLabel] ?? {
      durationTotal: 0,
      sizeTotal: 0,
      count: 0,
    }
    metrics.durationTotal += durationMs
    metrics.sizeTotal += size
    metrics.count += 1
    this.metrics[metricsLabel] = metrics
  }

  private _flushMetrics() {
    for (const key in this.metrics) {
      const metrics = this.metrics[key]
      // Note, there is no division by zero, because there are no zero count
      // metrics
      this.logger.info('Http metrics', {
        durationTotal: metrics.durationTotal,
        durationAvg: metrics.durationTotal / metrics.count,
        sizeTotal: metrics.sizeTotal,
        sizeAvg: metrics.sizeTotal / metrics.count,
        count: metrics.count,
      })
    }
    this.metrics = {}
  }
}

export function makeHttpResponse(
  status: number,
  body: string,
  headers = new Headers(),
): HttpResponse {
  const ok = status >= 200 && status < 300
  return { body, ok, status, headers }
}

export class MockHttp extends Http {
  private queue: (HttpResponse | 'NETWORK_ERROR')[] = []
  lastFetch?: { url: string; init: RequestInit }

  queueResponse(status: number, body: string, headers = new Headers()) {
    this.queue.push(makeHttpResponse(status, body, headers))
    return this
  }

  queueNetworkError() {
    this.queue.push('NETWORK_ERROR')
  }

  override fetch(url: string, init: RequestInit) {
    this.lastFetch = { url, init }
    const res = this.queue.shift()
    if (res === 'NETWORK_ERROR') {
      throw new Error('Failed to fetch: network error.')
    }
    if (res) {
      return Promise.resolve(res)
    }
    throw new Error('No responses queued!')
  }
}
