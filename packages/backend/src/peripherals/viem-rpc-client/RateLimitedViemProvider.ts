import { RateLimiter } from '@l2beat/shared-pure'
import { PublicClient } from 'viem'

export class RateLimitedViemProvider {
  private readonly rateLimiter: RateLimiter
  getTransaction: PublicClient['getTransaction']
  getTransactionReceipt: PublicClient['getTransactionReceipt']
  getBlock: PublicClient['getBlock']

  constructor(private readonly provider: PublicClient, callsPerMinute: number) {
    this.rateLimiter = new RateLimiter({ callsPerMinute })
    this.getTransaction = this.rateLimiter.wrap(
      this.provider.getTransaction.bind(this.provider),
    )
    this.getTransactionReceipt = this.rateLimiter.wrap(
      this.provider.getTransactionReceipt.bind(this.provider),
    )
    this.getBlock = this.rateLimiter.wrap(
      this.provider.getBlock.bind(this.provider),
    )
  }
}
