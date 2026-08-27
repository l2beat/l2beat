import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type { BlockClient, BlockHeader } from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

export class BlockProvider {
  constructor(
    readonly chain: string,
    private readonly clients: BlockClient[],
  ) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getLatestBlockNumber(): Promise<number> {
    return await this.tryClients((client) => client.getLatestBlockNumber())
  }

  async getBlockWithTransactions(x: number | 'latest'): Promise<Block> {
    return await this.tryClients(async (client) => {
      const block = await client.getBlockWithTransactions(x)
      assertBlockNumber(block, x)
      return block
    })
  }

  async getBlockHeader(x: number | 'latest'): Promise<BlockHeader> {
    return await this.tryClients(async (client) => {
      const header = await client.getBlockHeader(x)
      assertBlockNumber(header, x)
      return header
    })
  }

  async getBlockTimestamps(
    blockNumbers: number[],
  ): Promise<Map<number, UnixTime>> {
    return await this.tryClients(async (client) => {
      assert(
        client.getBlockTimestamps,
        'Client does not support batch fetching of block timestamps',
      )
      const out = new Map<number, UnixTime>()
      const timestamps = await client.getBlockTimestamps(blockNumbers)
      for (const [n, ts] of timestamps) {
        out.set(n, UnixTime(ts))
      }
      assert(out.size === blockNumbers.length, 'Missing block timestamps')
      return out
    })
  }

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    start = 1,
  ): Promise<number> {
    return await this.tryClients(async (client) => {
      const end = await client.getLatestBlockNumber()
      const effectiveStart = start >= end ? 1 : start

      return await getBlockNumberAtOrBefore(
        timestamp,
        effectiveStart,
        end,
        (number: number) => client.getBlockWithTransactions(number),
      )
    })
  }

  private async tryClients<T>(
    callback: (client: BlockClient) => Promise<T>,
  ): Promise<T> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await callback(client)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing ${this.chain.toUpperCase()}_RPC_URL`)
  }
}

function assertBlockNumber(block: { number: number }, x: number | 'latest') {
  if (typeof x === 'number') {
    assert(
      block.number === x,
      `Invalid response: expected block number ${x}, got ${block.number}`,
    )
  }
}
