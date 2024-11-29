import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { EthereumAddress, getErrorMessage } from '@l2beat/shared-pure'
import { HttpClient } from '../HttpClient'
import {
  BlockscoutGetInternalTransactionsResponse,
  BlockscoutInternalTransaction,
} from './model'

export class BlockscoutV2Client {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 10_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
    this.logger = logger.for(this)
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: { url: string },
  ) {
    return new BlockscoutV2Client(
      services.httpClient,
      options.url,
      services.logger,
    )
  }

  async getInternalTransactions(
    address: EthereumAddress,
  ): Promise<BlockscoutInternalTransaction[]> {
    const result = await this.call(
      'addresses',
      address.toString(),
      'internal-transactions',
    )

    return BlockscoutGetInternalTransactionsResponse.parse(result).items
  }

  async call(
    module: string,
    id: string,
    action: string,
    params?: Record<string, string>,
  ) {
    let url = `${this.url}/${module}/${id}/${action}`

    if (params) {
      const query = new URLSearchParams({
        ...params,
      })
      url = `${url}?${query.toString()}`
    }

    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: this.timeoutMs })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(module, action, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status}`,
      )
    }

    return JSON.parse(text)
  }

  private recordError(
    module: string,
    action: string,
    timeMs: number,
    message: string,
  ) {
    this.logger.debug({ type: 'error', message, timeMs, module, action })
  }
}
