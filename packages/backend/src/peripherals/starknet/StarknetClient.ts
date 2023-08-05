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

  async getBlock(blockNumber: number | 'latest') {
    const params =
      blockNumber === 'latest' ? ['latest'] : [{ block_number: blockNumber }]

    const response = await this.httpClient.fetch(this.url, {
      method: 'POST',
      headers: {
        ['Content-Type']: 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'starknet_getBlockWithTxHashes',
        params,
        id: Math.floor(Math.random() * 1000),
      }),
    })

    assert(
      response.ok,
      `Starknet getBlock request failed with status: ${response.status}`,
    )
    const text = await response.text()
    const json: unknown = JSON.parse(text)

    const { result: block } = StarknetGetBlockResponseBodySchema.parse(json)
    return {
      number: block.block_number,
      timestamp: block.timestamp,
      transactions: block.transactions,
    }
  }
}
