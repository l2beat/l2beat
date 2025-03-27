import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { json } from '@l2beat/shared-pure'
import type { RequestInit } from 'node-fetch'
import { RetryHandler, type RetryHandlerVariant } from '../tools'
import type { HttpClient } from './http/HttpClient'

export interface ClientCoreDependencies {
  http: HttpClient
  logger: Logger
  sourceName: string
  callsPerMinute: number
  retryStrategy: RetryHandlerVariant
}

type Metrics = {
  sizeAvg: number
  sizeTotal: number
  durationAvg: number
  durationTotal: number
  count: number
}

export abstract class ClientCore {
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  logger: Logger
  metricsBuffer: { duration: number; size: number }[] = []

  constructor(private readonly deps: ClientCoreDependencies) {
    this.logger = deps.logger.tag({ source: deps.sourceName })
    this.retryHandler = RetryHandler.create(
      deps.retryStrategy,
      this.logger.tag({ tag: deps.sourceName, source: deps.sourceName }),
    )
    this.rateLimiter = new RateLimiter({ callsPerMinute: deps.callsPerMinute })
    this.start()
  }

  /**
   * This method will perform HTTP fetch, and validate the response.
   * Rate limiting and retry handling are built-in.
   *
   * @param url Address to which the request will be sent
   * @param init Params for the request. We are using `node-fetch` RequestInit type
   * @returns Parsed JSON object
   */
  async fetch(url: string, init: RequestInit): Promise<json> {
    try {
      return await this.rateLimiter.call(() => this._fetch(url, init))
    } catch {
      return await this.retryHandler.retry(() =>
        this.rateLimiter.call(() => this._fetch(url, init)),
      )
    }
  }

  private async _fetch(url: string, init: RequestInit): Promise<json> {
    const start = Date.now()

    const response = await this.deps.http.fetch(url, init)

    const duration = Date.now() - start
    const size = Buffer.byteLength(JSON.stringify(response), 'utf8')

    this.metricsBuffer.push({ duration, size: size })

    const validationInfo = this.validateResponse(response)

    if (!validationInfo.success) {
      throw new Error(validationInfo.message ?? 'Response validation failed')
    }

    return response
  }

  /** This method should return false when there are errors in the response, true otherwise */
  abstract validateResponse(response: json): {
    success: boolean
    message?: string
  }

  private start(): void {
    const interval = setInterval(async () => {
      await this.logMetrics()
    }, 30_000)

    // object will not require the Node.js event loop to remain active
    // nodejs.org/api/timers.html#timers_timeout_unref
    interval.unref()
  }

  private logMetrics() {
    if (!this.metricsBuffer.length) {
      return
    }

    const metrics = this.metricsBuffer.reduce(
      (acc: Metrics, curr, index) => {
        if (index === this.metricsBuffer.length - 1) {
          return {
            sizeAvg: Math.floor(
              (acc.sizeAvg + curr.size) / this.metricsBuffer.length,
            ),
            sizeTotal: acc.sizeTotal + curr.size,
            durationAvg: Math.floor(
              (acc.durationAvg + curr.duration) / this.metricsBuffer.length,
            ),
            durationTotal: acc.durationTotal + curr.duration,
            count: acc.count + 1,
          }
        }

        return {
          sizeAvg: acc.sizeAvg + curr.size,
          sizeTotal: acc.sizeTotal + curr.size,
          durationAvg: acc.durationAvg + curr.duration,
          durationTotal: acc.durationTotal + curr.duration,
          count: acc.count + 1,
        }
      },
      { sizeAvg: 0, sizeTotal: 0, durationAvg: 0, durationTotal: 0, count: 0 },
    )

    //clear buffer
    this.metricsBuffer.splice(0)

    this.deps.logger.info('Http metrics', { ...metrics })
  }
}
