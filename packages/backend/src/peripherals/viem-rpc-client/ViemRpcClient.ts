import type { Logger } from '@l2beat/backend-tools'
import { http, type PublicClient, createPublicClient } from 'viem'

import { RateLimitedViemProvider } from './RateLimitedViemProvider'

export class ViemRpcClient {
  private readonly provider: RateLimitedViemProvider

  constructor(
    provider: PublicClient,
    private readonly logger: Logger,
    callsPerMinute = Infinity,
  ) {
    this.logger = this.logger.for(this)
    this.provider = new RateLimitedViemProvider(provider, callsPerMinute)
  }

  static create(
    services: { logger: Logger },
    options: { url: string; callsPerMinute: number | undefined },
  ) {
    const publicClient = createPublicClient({
      transport: http(options.url),
    })
    return new ViemRpcClient(
      publicClient,
      services.logger,
      options.callsPerMinute,
    )
  }

  async getTransaction(txHash: `0x${string}`) {
    // eth_getTransactionByHash
    return await this.provider.getTransaction({
      hash: txHash,
    })
  }

  async getTransactionReceipt(txHash: `0x${string}`) {
    // eth_getTransactionReceipt
    return await this.provider.getTransactionReceipt({
      hash: txHash,
    })
  }
}
