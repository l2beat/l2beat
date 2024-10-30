import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { json } from '@l2beat/shared-pure'
import { RequestInit } from 'node-fetch'
import { RetryHandler } from '../tools'
import { HttpClient2 } from './http/HttpClient2'

export interface ClientCoreDeps {
  http: HttpClient2
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  logger: Logger
}

export abstract class ClientCore {
  constructor(protected readonly deps: ClientCoreDeps) { }


  /** This method will call prepareRequest, perform HTTP fetch and validate the response.
  * Rate limiting and retry handling is built-in.
  */
  async query(...args: unknown[]): Promise<json> {
    try {
      return await this.deps.rateLimiter.call(() => this._query(...args))
    } catch {
      return await this.deps.retryHandler.retry(() =>
        this.deps.rateLimiter.call(() => this._query(...args)),
      )
    }
  }

  private async _query(...args: unknown[]): Promise<json> {
    const request = this.prepareRequest(...args)

    const response = await this.deps.http.fetch(request.url, request.init)

    const isResponseValid = this.validateResponse(response)

    if (isResponseValid === false) {
      throw new Error('Response validation failed')
    }

    return response
  }

  /** This method should return params that will be used for HTTP fetch */
  abstract prepareRequest(...args: unknown[]): { url: string, init: RequestInit }

  /** This method should return false when there are errors in the response, true otherwise */
  abstract validateResponse(response: unknown): boolean
}
