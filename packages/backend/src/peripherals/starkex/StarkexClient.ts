import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { getErrorMessage, json, RateLimiter } from '@l2beat/shared-pure'

import { parseStarkexApiResponse } from './parseStarkexApiResponse'

interface StarkexClientOpts {
  callsPerMinute?: number
  timeout?: number
}

export const STARKEX_BI_API_V2 = 'https://bi-cf-v2-gw-ddper8ah.uc.gateway.dev'
export const STARKEX_BI_API_V3 = 'https://bi-cf-v3-ddper8ah.uc.gateway.dev'

export class StarkexClient {
  timeout: number

  constructor(
    private readonly apiKey: string,
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    opts?: StarkexClientOpts,
  ) {
    this.logger = this.logger.for(this)
    this.timeout = opts?.timeout ?? 10_000
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.call = rateLimiter.wrap(this.call.bind(this))
    }
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: {
      apiKey: string
      callsPerMinute: number | undefined
      timeout: number | undefined
    },
  ) {
    return new StarkexClient(
      options.apiKey,
      services.httpClient,
      services.logger,
      options,
    )
  }

  async getDailyCount(day: number, product: string): Promise<number> {
    const body = getBody(day, product)

    const response =
      product === 'dydx'
        ? await this.call(STARKEX_BI_API_V2, '/aggregations/count', body)
        : await this.call(STARKEX_BI_API_V3, '/aggregations/count', body)

    return response.count
  }

  async call(apiUrl: string, path: string, body: json) {
    const start = Date.now()
    const url = apiUrl + path + `?key=${this.apiKey}`
    const { httpResponse, error } = await this.httpClient
      .fetch(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
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

    const responseText = await httpResponse.text()

    if (!httpResponse.ok) {
      this.recordError(timeMs, responseText)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}: ${responseText}`,
      )
    }

    const starkexApiResponse = parseStarkexApiResponse(responseText)

    this.logger.debug({ type: 'success', timeMs })

    return starkexApiResponse
  }

  private recordError(timeMs: number, message: string) {
    this.logger.debug({ type: 'error', message, timeMs })
  }
}
function getBody(day: number, product: string) {
  const bodyV3 = {
    day_start: day,
    day_end: day + 1,
    product,
  }

  if (product !== 'dydx') return bodyV3

  return {
    ...bodyV3,
    tx_type: '_all',
    token_id: '_all',
  }
}
