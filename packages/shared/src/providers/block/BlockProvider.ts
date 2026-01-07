import { assert, type Block, type UnixTime } from '@l2beat/shared-pure'
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

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    start = 0,
  ): Promise<number> {
    for (const [index, client] of this.clients.entries()) {
      try {
        const end = await client.getLatestBlockNumber()

        return await getBlockNumberAtOrBefore(
          timestamp,
          start,
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
