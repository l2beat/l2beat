import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import {
  EthereumAddress,
  RateLimiter,
  getErrorMessage,
} from '@l2beat/shared-pure'
import {
  BlockscoutGetInternalTransactionsResponse,
  BlockscoutInternalTransaction,
} from './schemas'

export class BlockscoutClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: { url: string },
  ) {
    return new BlockscoutClient(
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
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
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
