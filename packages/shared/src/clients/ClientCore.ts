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

  async fetch(url: string, init: RequestInit): Promise<json> {
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

    const isResponseValid = this.validateResponse(response)

    if (isResponseValid === false) {
      throw new Error('Response validation failed')
    }

    return response
  }

  /** This method should prepare params for fetch */
  abstract validateResponse(response: unknown): boolean
}
