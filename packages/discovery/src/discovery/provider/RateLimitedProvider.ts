import { RateLimiter } from '@l2beat/backend-tools'
import type { providers } from 'ethers'

// TODO: This class doesn't belong here! It's not used in discovery
export class RateLimitedProvider {
  private readonly rateLimiter: RateLimiter
  call: providers.Provider['call']
  getBlock: providers.Provider['getBlock']
  getBlockNumber: providers.Provider['getBlockNumber']
  getLogs: providers.Provider['getLogs']
  getBalance: providers.Provider['getBalance']
  getStorageAt: providers.Provider['getStorageAt']
  getTransaction: providers.Provider['getTransaction']
  getCode: providers.Provider['getCode']
  send: providers.JsonRpcProvider['send']

  constructor(
    private readonly provider: providers.JsonRpcProvider,
    callsPerMinute: number,
  ) {
    this.rateLimiter = new RateLimiter({ callsPerMinute })
    this.call = this.rateLimiter.wrap(this.provider.call.bind(this.provider))
    this.getBlock = this.rateLimiter.wrap(
      this.provider.getBlock.bind(this.provider),
    )
    this.getBlockNumber = this.rateLimiter.wrap(
      this.provider.getBlockNumber.bind(this.provider),
    )
    this.getLogs = this.rateLimiter.wrap(
      this.provider.getLogs.bind(this.provider),
    )
    this.getBalance = this.rateLimiter.wrap(
      this.provider.getBalance.bind(this.provider),
    )
    this.getStorageAt = this.rateLimiter.wrap(
      this.provider.getStorageAt.bind(this.provider),
    )
    this.getTransaction = this.rateLimiter.wrap(
      this.provider.getTransaction.bind(this.provider),
    )
    this.getCode = this.rateLimiter.wrap(
      this.provider.getCode.bind(this.provider),
    )
    this.send = this.rateLimiter.wrap(this.provider.send.bind(this.provider))
  }
}
