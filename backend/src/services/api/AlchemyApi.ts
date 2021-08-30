import { providers } from 'ethers'

import { Logger } from '../Logger'
import { ExponentialRetry } from './ExponentialRetry'
import { RateLimiter } from './RateLimiter'

export class AlchemyApi {
  private provider = new providers.StaticJsonRpcProvider(this.url, 'mainnet')
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

  private async safeCall<T>(message: string, fn: () => Promise<T>): Promise<T> {
    return this.exponentialRetry.call(() => this.rateLimiter.call(fn), message)
  }
}
