import { StarkexProduct } from '@l2beat/config'
import { HttpClient, Logger } from '@l2beat/shared'
import { getErrorMessage, json, RateLimiter } from '@l2beat/shared-pure'

import { parseStarkexApiResponse } from './parseStarkexApiResponse'

interface StarkexClientOpts {
  callsPerMinute?: number
  apiUrl?: string
  timeout?: number
}

const API_URL = 'https://bi-cf-v2-gw-ddper8ah.uc.gateway.dev'

export class StarkexClient {
  timeout: number
  apiUrl: string

  constructor(
    private readonly apiKey: string,
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    opts?: StarkexClientOpts,
  ) {
    this.logger = this.logger.for(this)
    this.timeout = opts?.timeout ?? 10_000
    this.apiUrl = opts?.apiUrl ?? API_URL
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.call = rateLimiter.wrap(this.call.bind(this))
    }
  }

  async getDailyCount(day: number, product: StarkexProduct): Promise<number> {
    const body = {
      day_start: day,
      day_end: day + 1,
      product,
      tx_type: '_all',
      token_id: '_all',
    }

    const response = await this.call('/aggregations/count', body)
    return response.count
  }

  async call(path: string, body: json) {
    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(this.apiUrl + path, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(body),
        timeout: this.timeout,
      })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(timeMs, message)
      throw error
    }

    const text = await httpResponse.text()

    if (!httpResponse.ok) {
      this.recordError(timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    const starkexApiResponse = parseStarkexApiResponse(text)

    this.logger.debug({ type: 'success', timeMs })

    return starkexApiResponse
  }

  private recordError(timeMs: number, message: string) {
    this.logger.debug({ type: 'error', message, timeMs })
  }
}
