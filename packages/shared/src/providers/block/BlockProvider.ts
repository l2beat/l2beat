import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type { BlockClient, BlockHeader } from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

export class BlockProvider {
  // Consumers ask for hourly, increasing timestamps, so the previous answer is
  // a much better lower bound for the next search than block 1
  private lastFound: BlockHeader | undefined

  constructor(
    readonly chain: string,
    private readonly clients: BlockClient[],
  ) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getLatestBlockNumber(): Promise<number> {
    return await this.withClient((client) => client.getLatestBlockNumber())
  }

  async getBlockWithTransactions(x: number | 'latest'): Promise<Block> {
    return await this.withClient(async (client) => {
      const block = await client.getBlockWithTransactions(x)
      assertBlockNumber(block, x)
      return block
    })
  }

  async getBlockHeader(x: number | 'latest'): Promise<BlockHeader> {
    return await this.withClient((client) => getBlockHeader(client, x))
  }

  async getBlockTimestamps(
    blockNumbers: number[],
  ): Promise<Map<number, UnixTime>> {
    return await this.withClient(async (client) => {
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

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    return await this.withClient(async (client) => {
      const known = new Map<number, BlockHeader>()
      const getHeader = async (x: number | 'latest') => {
        const cached = x !== 'latest' ? known.get(x) : undefined
        if (cached) return cached
        const header = await getBlockHeader(client, x)
        known.set(header.number, header)
        return header
      }

      const latest = await getHeader('latest')
      if (timestamp >= latest.timestamp) return latest.number

      let start = 1
      const seed = this.lastFound
      if (seed && seed.timestamp <= timestamp && seed.number < latest.number) {
        known.set(seed.number, seed)
        start = seed.number
      }

      const found = await getBlockNumberAtOrBefore(
        timestamp,
        start,
        latest.number,
        getHeader,
      )
      this.lastFound = known.get(found)
      return found
    })
  }

  private async withClient<T>(
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

async function getBlockHeader(
  client: BlockClient,
  x: number | 'latest',
): Promise<BlockHeader> {
  if (client.getBlockHeader) {
    const header = await client.getBlockHeader(x)
    assertBlockNumber(header, x)
    return header
  }
  // Non-EVM clients only accept concrete block numbers
  const number = x === 'latest' ? await client.getLatestBlockNumber() : x
  const block = await client.getBlockWithTransactions(number)
  assertBlockNumber(block, number)
  return block
}

function assertBlockNumber(block: { number: number }, x: number | 'latest') {
  if (typeof x === 'number') {
    assert(
      block.number === x,
      `Invalid response: expected block number ${x}, got ${block.number}`,
    )
  }
}
