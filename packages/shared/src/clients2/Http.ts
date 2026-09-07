import { Logger, RateLimiter } from '@l2beat/backend-tools'
import fetch, { Headers, type RequestInit } from 'node-fetch'
import { getRpcMetricsLabel } from '../clients/rpc/RpcMetricsContext'

export interface HttpOptions {
  timeoutMs: number
  maxCallsPerMinute: number
  metricsEnabled: boolean
  metricsFlushIntervalMs: number
  logger: Logger
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

  async fetch(url: string, init: RequestInit): Promise<HttpResponse> {
    // Resolved here, synchronously in the caller's async context. The rate
    // limiter dispatches later from a timer or another call's completion, so
    // the context is not reliable inside `_fetch`.
    const label = getRpcMetricsLabel()
    const request: RequestInit = { timeout: this.timeoutMs, ...init }
    if (this.rateLimiter) {
      return await this.rateLimiter.call(
        () => this._fetch(url, request, label),
        label,
      )
    }
    return await this._fetch(url, request, label)
  }

  protected async _fetch(
    url: string,
    init: RequestInit,
    label: string,
  ): Promise<HttpResponse> {
    const start = Date.now()
    const res = await fetch(url, init)
    // We need to await text because we don't know if someone wants json or not
    // and we need to actually consume the response body not just the headers
    const body = await res.text()
    this._trackMetrics(label, Date.now() - start, res.size)
    return {
      body,
      ok: res.ok,
      status: res.status,
      headers: res.headers,
    }
  }

  protected _trackMetrics(label: string, durationMs: number, size: number) {
    if (!this.metricsEnabled) return
    const metrics = this.metrics[label] ?? {
      durationTotal: 0,
      sizeTotal: 0,
      count: 0,
    }
    metrics.durationTotal += durationMs
    metrics.sizeTotal += size
    metrics.count += 1
    this.metrics[label] = metrics
  }

  private _flushMetrics() {
    const rateLimiter = this.rateLimiter
    const limiter = rateLimiter?.takeStats()
    const labels = new Set([
      ...Object.keys(this.metrics),
      ...Object.keys(limiter?.labels ?? {}),
    ])
    for (const label of labels) {
      const metrics = this.metrics[label] ?? {
        durationTotal: 0,
        sizeTotal: 0,
        count: 0,
      }
      const wait = limiter?.labels[label]
      this.logger.info('Http metrics', {
        label,
        durationTotal: metrics.durationTotal,
        durationAvg:
          metrics.count > 0 ? metrics.durationTotal / metrics.count : 0,
        sizeTotal: metrics.sizeTotal,
        sizeAvg: metrics.count > 0 ? metrics.sizeTotal / metrics.count : 0,
        count: metrics.count,
        ...(wait && {
          waitTotal: wait.waitMsTotal,
          waitAvg:
            wait.dispatched > 0
              ? Math.floor(wait.waitMsTotal / wait.dispatched)
              : 0,
          waitMax: wait.waitMsMax,
          queueDepthMax: wait.queueDepthMax,
        }),
        ...(rateLimiter &&
          limiter && {
            limiterInFlightMax: limiter.inFlightMax,
            callsPerMinute: rateLimiter.callsPerMinute,
          }),
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
