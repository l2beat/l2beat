import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type { BlockClient } from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

export class BlockProvider {
  constructor(
    readonly chain: string,
    private readonly clients: BlockClient[],
  ) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getLatestBlockNumber(): Promise<number> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getLatestBlockNumber()
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing ${this.chain.toUpperCase()}_RPC_URL`)
  }

  async getBlockWithTransactions(x: number | 'latest'): Promise<Block> {
    for (const [index, client] of this.clients.entries()) {
      try {
        const block = await client.getBlockWithTransactions(x)
        if (typeof x === 'number') {
          assert(
            block.number === x,
            `Invalid response: expected block number ${x}, got ${block.number}`,
          )
        }
        return block
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing ${this.chain.toUpperCase()}_RPC_URL`)
  }

  async getBlockTimestamps(
    blockNumbers: number[],
  ): Promise<Map<number, UnixTime>> {
    for (const [index, client] of this.clients.entries()) {
      try {
        assert(
          client.getBlockTimestamps,
          'Client does not support batch fetching of block timestamps',
        )
        const out = new Map<number, UnixTime>()
        const timestamps = await client.getBlockTimestamps(blockNumbers)
        for (const [n, ts] of timestamps) {
          out.set(n, UnixTime(ts))
        }
        return out
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing ${this.chain.toUpperCase()}_RPC_URL`)
  }

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    start = 1,
  ): Promise<number> {
    for (const [index, client] of this.clients.entries()) {
      try {
        const end = await client.getLatestBlockNumber()
        const effectiveStart = start >= end ? 1 : start

        return await getBlockNumberAtOrBefore(
          timestamp,
          effectiveStart,
          end,
          (number: number) => client.getBlockWithTransactions(number),
        )
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing ${this.chain.toUpperCase()}_RPC_URL`)
  }
}
