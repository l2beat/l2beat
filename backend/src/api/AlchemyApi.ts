import { z } from 'zod'
import { Logger } from '../services/Logger'
import { ExponentialRetry } from './ExponentialRetry'
import { JsonRpcApi } from './JsonRpcApi'
import { RateLimiter } from './RateLimiter'

const getBlockResponse = z.object({
  timestamp: z.string(),
})

export class AlchemyApi {
  private api = new JsonRpcApi(this.url)
  private rateLimiter = new RateLimiter({
    callsPerMinute: 500,
  })
  private exponentialRetry = new ExponentialRetry(
    {
      // TODO: tweak, we should be able to do Infinity
      maxRetryCount: 10,
      startTimeout: 100,
    },
    this.logger
  )

  constructor(private url: string, private logger: Logger) {}

  async getBlock(blockNumber: number) {
    const response = await this.call('eth_getBlockByNumber', [
      `0x${blockNumber.toString(16)}`,
      false,
    ])
    const block = getBlockResponse.parse(response)
    return { timestamp: parseInt(block.timestamp.substring(2), 16) }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private call(method: string, params: any[]) {
    return this.exponentialRetry.call(
      () => this.rateLimiter.call(() => this.api.call(method, params)),
      method
    )
  }
}
