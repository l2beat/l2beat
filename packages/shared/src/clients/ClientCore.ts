import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { json } from '@l2beat/shared-pure'
import type { RequestInit } from 'node-fetch'
import { RetryHandler, type RetryHandlerVariant } from '../tools'
import { ClientMetricsAggregator } from './ClientMetricsAggregator'
import type { HttpClient } from './http/HttpClient'

export interface ClientCoreDependencies {
  http: HttpClient
  logger: Logger
  sourceName: string
  callsPerMinute: number
  retryStrategy: RetryHandlerVariant
}

export abstract class ClientCore {
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  metricsAggregator: ClientMetricsAggregator

  constructor(private readonly deps: ClientCoreDependencies) {
    const logger = deps.logger.for(this).tag({ source: deps.sourceName })
    this.metricsAggregator = new ClientMetricsAggregator({
      logger,
      flushInterval: 30_000,
    })

    this.retryHandler = RetryHandler.create(
      deps.retryStrategy,
      logger.tag({ tag: deps.sourceName, source: deps.sourceName }),
    )
    this.rateLimiter = new RateLimiter({ callsPerMinute: deps.callsPerMinute })
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

    this.metricsAggregator.push({ duration, size: size })

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
}
