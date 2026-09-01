import { Logger, RateLimiter } from '@l2beat/backend-tools'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { HttpClient } from '../../clients'
import {
  BlockscoutAddressInfo,
  type BlockscoutAddressInfo as BlockscoutAddressInfoResponse,
  BlockscoutGetInternalTransactionsResponse,
  type BlockscoutInternalTransaction,
  BlockscoutSmartContract,
  type BlockscoutSmartContract as BlockscoutSmartContractResponse,
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
    this.getSmartContract = this.rateLimiter.wrap(
      this.getSmartContract.bind(this),
    )
    this.logger = logger.for(this)
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

  async getSmartContract(
    address: EthereumAddress,
  ): Promise<BlockscoutSmartContractResponse | undefined> {
    const url = `${this.url}/smart-contracts/${address.toString()}`
    const response = await this.httpClient.fetchRaw(url, {
      timeout: this.timeoutMs,
    })

    if (response.status === 404) {
      return undefined
    }

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
    }

    return BlockscoutSmartContract.parse(await response.json())
  }

  async getAddress(
    address: EthereumAddress,
  ): Promise<BlockscoutAddressInfoResponse> {
    const result = await this.call('addresses', address.toString())
    return BlockscoutAddressInfo.parse(result)
  }

  async call(
    module: string,
    id?: string,
    action?: string,
    params?: Record<string, string>,
  ) {
    const path = [module, id, action]
      .filter((part): part is string => part !== undefined)
      .join('/')
    let url = `${this.url}/${path}`

    if (params) {
      const query = new URLSearchParams({
        ...params,
      })
      url = `${url}?${query.toString()}`
    }

    return await this.httpClient.fetch(url, { timeout: this.timeoutMs })
  }
}
