import { HttpClient } from '@l2beat/shared'
import { assert, RateLimiter, UnixTime } from '@l2beat/shared-pure'

import { getBlockNumberAtOrBefore } from '../getBlockNumberAtOrBefore'
import { StarknetGetBlockResponseBodySchema } from './schemas'

interface StarknetClientOpts {
  callsPerMinute?: number
}

export class StarknetClient {
  constructor(
    readonly url: string,
    private readonly httpClient: HttpClient,
    opts?: StarknetClientOpts,
  ) {
    if (opts?.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: opts.callsPerMinute,
      })
      this.getBlockNumber = rateLimiter.wrap(this.getBlockNumber.bind(this))
      this.getBlock = rateLimiter.wrap(this.getBlock.bind(this))
    }
  }

  async getBlockNumber() {
    const block = await this.getBlock('latest')
    return block.number
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getBlockNumber()

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      this.getBlock.bind(this),
    )
  }

  async getBlock(blockNumber: number | string) {
    const response = await this.httpClient.fetch(
      `${this.url}/feeder_gateway/get_block?blockNumber=${blockNumber}`,
    )
    assert(
      response.ok,
      `Starknet getBlock request failed with status: ${response.status}`,
    )
    const data: unknown = await response.json()
    const block = StarknetGetBlockResponseBodySchema.parse(data)
    return {
      number: block.block_number,
      timestamp: block.timestamp,
      transactions: block.transactions,
    }
  }
}
