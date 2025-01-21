import { RateLimiter } from '@l2beat/backend-tools'
import type { PublicClient } from 'viem'

export class RateLimitedViemProvider {
  private readonly rateLimiter: RateLimiter
  getTransaction: PublicClient['getTransaction']
  getTransactionReceipt: PublicClient['getTransactionReceipt']

  constructor(
    private readonly provider: PublicClient,
    callsPerMinute: number,
  ) {
    this.rateLimiter = new RateLimiter({ callsPerMinute })
    this.getTransaction = this.rateLimiter.wrap(
      this.provider.getTransaction.bind(this.provider),
    )
    this.getTransactionReceipt = this.rateLimiter.wrap(
      this.provider.getTransactionReceipt.bind(this.provider),
    )
  }
}
