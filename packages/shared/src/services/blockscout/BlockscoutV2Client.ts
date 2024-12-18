import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { HttpClient } from '../../clients'
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

    return await this.httpClient.fetch(url, { timeout: this.timeoutMs })
  }
}
