import { Logger } from '../services/Logger'
import { ExponentialRetry } from './ExponentialRetry'
import { RateLimiter } from './RateLimiter'
import fetch from 'node-fetch'
import { z } from 'zod'

const BLOCK_URL =
  'https://api.etherscan.io/api?module=block&action=getblocknobytime&closest=before'

const response = z.object({
  result: z.string(),
})

export class EtherscanApi {
  private rateLimiter = new RateLimiter({
    callsPerMinute: 200,
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
      return parseInt(response.parse(data).result)
    })
  }

  private async safeCall<T>(message: string, fn: () => Promise<T>): Promise<T> {
    return this.exponentialRetry.call(() => this.rateLimiter.call(fn), message)
  }
}
