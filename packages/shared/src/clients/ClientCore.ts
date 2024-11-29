import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { json } from '@l2beat/shared-pure'
import { RetryHandler } from '../tools'
import { HttpClient2 } from './http/HttpClient2'

export interface ClientCoreDependencies {
  http: HttpClient2
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  logger: Logger
}

export abstract class ClientCore {
  constructor(private readonly deps: ClientCoreDependencies) {}

  /**
   * This method will perform HTTP fetch, and validate the response.
   * Rate limiting and retry handling are built-in.
   *
   * @param url Address to which the request will be sent
   * @param init Params for the request
   * @returns Parsed JSON object
   */
  async fetch(
    url: string,
    init: RequestInit & { timeout?: number },
  ): Promise<json> {
    try {
      return await this.deps.rateLimiter.call(() => this._fetch(url, init))
    } catch {
      return await this.deps.retryHandler.retry(() =>
        this.deps.rateLimiter.call(() => this._fetch(url, init)),
      )
    }
  }

  private async _fetch(url: string, init: RequestInit): Promise<json> {
    const response = await this.deps.http.fetch(url, init)

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
