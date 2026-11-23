import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { json } from '@l2beat/shared-pure'
import { RetryHandler, type RetryHandlerVariant } from '../tools'
import { ClientMetricsAggregator } from './ClientMetricsAggregator'
import type { FetchInit } from './http/fetchWithTimeout'
import type { HttpClient } from './http/HttpClient'
import { isRefusedForRate, readRefusal } from './http/rateRefusal'
import { getRpcMetricsLabel } from './rpc/RpcMetricsContext'

export interface ClientCoreDependencies {
  http: HttpClient
  logger: Logger
  sourceName: string
  callsPerMinute: number
  retryStrategy: RetryHandlerVariant
  /** See `share` in `RateLimiterOptions.stepDownOnThrottle`. */
  stepDownOnThrottle?: number
  /** See `isRefusedForRate` */
  refusesRateWithCloudFront403?: boolean
}

export abstract class ClientCore {
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  metricsAggregator: ClientMetricsAggregator

  constructor(private readonly deps: ClientCoreDependencies) {
    const logger = deps.logger.for(this).tag({ source: deps.sourceName })
    this.rateLimiter = new RateLimiter({
      callsPerMinute: deps.callsPerMinute,
      stepDownOnThrottle: deps.stepDownOnThrottle
        ? {
            share: deps.stepDownOnThrottle,
            onStep: (step) => logger.warn('Rate stepped down', step),
          }
        : undefined,
    })
    this.metricsAggregator = new ClientMetricsAggregator({
      logger,
      flushInterval: 30_000,
      rateLimiter: this.rateLimiter,
    })

    this.retryHandler = RetryHandler.create(
      deps.retryStrategy,
      logger.tag({ tag: deps.sourceName, source: deps.sourceName }),
    )
  }

  /**
   * This method will perform HTTP fetch, and validate the response.
   * Rate limiting and retry handling are built-in.
   *
   * @param url Address to which the request will be sent
   * @param init Params for the request, `timeout` is an idle timeout in ms
   * @returns Parsed JSON object
   */
  async fetch(url: string, init: FetchInit): Promise<json> {
    // Resolved here, synchronously in the caller's async context. The rate
    // limiter dispatches later from a timer or another call's completion, so
    // the context is not reliable inside `_fetch`.
    const label = getRpcMetricsLabel()
    try {
      return await this.rateLimiter.call(
        () => this._fetch(url, init, label),
        label,
      )
    } catch (error) {
      return await this.retryHandler.retry(
        () => this.rateLimiter.call(() => this._fetch(url, init, label), label),
        { error, url, init },
      )
    }
  }

  private async _fetch(
    url: string,
    init: FetchInit,
    label: string,
  ): Promise<json> {
    const start = Date.now()

    const response = await this.fetchAndReportThrottling(url, init)

    const duration = Date.now() - start
    const size = Buffer.byteLength(JSON.stringify(response), 'utf8')

    this.metricsAggregator.push({ duration, size, label })

    const validationInfo = this.validateResponse(response)

    if (!validationInfo.success) {
      throw new Error(validationInfo.message ?? 'Response validation failed')
    }

    this.rateLimiter.answered(start)
    return response
  }

  private async fetchAndReportThrottling(
    url: string,
    init: FetchInit,
  ): Promise<json> {
    const sentAt = Date.now()
    try {
      return await this.deps.http.fetch(url, init)
    } catch (error) {
      const refusal = readRefusal(error)
      if (
        refusal &&
        isRefusedForRate(refusal, this.deps.refusesRateWithCloudFront403)
      ) {
        this.rateLimiter.throttled(sentAt)
      }
      throw error
    }
  }

  /** This method should return false when there are errors in the response, true otherwise */
  abstract validateResponse(response: json): {
    success: boolean
    message?: string
  }
}
