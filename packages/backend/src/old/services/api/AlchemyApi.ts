import { Logger, RateLimiter } from '@l2beat/common'

import { CustomProvider } from './CustomProvider'
import { ExponentialRetry } from './ExponentialRetry'

export interface LogFilter {
  address: string | string[]
  topics: (string | string[] | null)[]
  fromBlock: number
  toBlock: number
}

export class AlchemyApi {
  private provider = new CustomProvider(this.url, 'mainnet')
  private rateLimiter = new RateLimiter({
    callsPerMinute: 500,
  })
  private exponentialRetry = new ExponentialRetry(
    {
      maxRetryCount: 10,
      startTimeout: 100,
    },
    this.logger
  )

  constructor(private url: string, private logger: Logger) {}

  async getBlock(blockNumber: number) {
    return this.safeCall(`getBlock(${blockNumber})`, async () => {
      return this.provider.getBlock(blockNumber)
    })
  }

  async getBalance(address: string, blockNumber: number) {
    return this.safeCall(`getBalance(${address}, ${blockNumber})`, async () => {
      return this.provider.getBalance(address, blockNumber)
    })
  }

  async call(address: string, data: string, blockNumber: number) {
    return this.safeCall(`call(${address}, ${blockNumber})`, async () => {
      return this.provider.call({ to: address, data }, blockNumber)
    })
  }

  async getLogs(filter: LogFilter) {
    return this.safeCall(
      `getLogs: ${filter.fromBlock} - ${filter.toBlock}`,
      async () => {
        // This is actually safe, because the provider has been specifically
        // modified to support this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.provider.getLogs(filter as any)
      }
    )
  }

  private async safeCall<T>(message: string, fn: () => Promise<T>): Promise<T> {
    return this.exponentialRetry.call(() => this.rateLimiter.call(fn), message)
  }
}
