import { RateLimiter } from '@l2beat/common'
import { Provider } from 'starknet'

interface StarkNetClientOpts {
  callsPerMinute?: number
}

export class StarkNetClient {
  provider: Provider

  constructor(opts?: StarkNetClientOpts) {
    this.provider = new Provider({ sequencer: { network: 'mainnet-alpha' } })
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.getBlockNumber = rateLimiter.wrap(this.getBlockNumber.bind(this))
      this.getBlock = rateLimiter.wrap(this.getBlock.bind(this))
    }
  }

  async getBlockNumber() {
    const result = await this.provider.getBlock('latest')
    return BigInt(result.block_number)
  }

  async getBlock(blockNumber: number) {
    const result = await this.provider.getBlock(blockNumber)
    return {
      number: result.block_number,
      timestamp: result.timestamp,
      transactions: result.transactions,
    }
  }
}
