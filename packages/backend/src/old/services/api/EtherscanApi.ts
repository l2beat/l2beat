import fetch from 'node-fetch'

import { Logger } from '../../../services/Logger'
import { RateLimiter } from '../../../services/utils/RateLimiter'
import { ExponentialRetry } from './ExponentialRetry'

const BLOCK_URL =
  'https://api.etherscan.io/api?module=block&action=getblocknobytime&closest=before'

export class EtherscanApi {
  private rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private exponentialRetry = new ExponentialRetry(
    {
      maxRetryCount: 10,
      startTimeout: 100,
    },
    this.logger
  )

  constructor(private etherscanApiKey: string, private logger: Logger) {}

  async getLastBlockBefore(timestamp: number) {
    return this.safeCall(`getLastBlockBefore(${timestamp})`, async () => {
      const res = await fetch(
        `${BLOCK_URL}&timestamp=${timestamp}&apikey=${this.etherscanApiKey}`
      )
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      const data = await res.json()
      if (
        typeof data !== 'object' ||
        data === null ||
        data.status !== '1' ||
        typeof data.result !== 'string' ||
        !/^\d+$/.test(data.result)
      ) {
        throw new Error('Invalid etherscan response')
      }
      return parseInt(data.result)
    })
  }

  private async safeCall<T>(message: string, fn: () => Promise<T>): Promise<T> {
    return this.exponentialRetry.call(() => this.rateLimiter.call(fn), message)
  }
}
