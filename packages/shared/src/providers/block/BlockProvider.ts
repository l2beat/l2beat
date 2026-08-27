import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type { BlockClient, BlockHeader } from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

// Headers younger than this are not cached: a reorg could replace the block
// and a stale timestamp would then mis-bracket later searches. Deeper than any
// reorg seen on the tracked chains (Ethereum finalizes in ~13 min).
const REORG_SAFETY_SECONDS = UnixTime.HOUR

export class BlockProvider {
  // Headers resolved by earlier timestamp searches, kept so later searches can
  // seed the interpolation from the closest known block instead of block 1 —
  // even when consumers ask for non-consecutive timestamps.
  private readonly knownHeaders = new Map<number, BlockHeader>()

  constructor(
    readonly chain: string,
    private readonly clients: BlockClient[],
    private readonly maxKnownHeaders = 1024,
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
      const latest = await client.getBlockHeader('latest')
      if (timestamp >= latest.timestamp) return latest.number

      const cacheable = latest.timestamp - REORG_SAFETY_SECONDS
      const getHeader = async (number: number) => {
        if (number === latest.number) return latest
        const cached = this.knownHeaders.get(number)
        if (cached) return cached
        const header = await client.getBlockHeader(number)
        assertBlockNumber(header, number)
        if (header.timestamp <= cacheable) this.remember(header)
        return header
      }

      // Narrow the search to the tightest bracket of already-known headers.
      // Block timestamps increase with block number, so any known header at or
      // before the target is a valid lower bound and any known header after it
      // an upper bound.
      let lo = start < latest.number ? start : 1
      let hi = latest.number
      for (const header of this.knownHeaders.values()) {
        if (header.number <= lo || header.number >= hi) continue
        if (header.timestamp <= timestamp) lo = header.number
        else hi = header.number
      }

      return await getBlockNumberAtOrBefore(timestamp, lo, hi, getHeader)
    })
  }

  private remember(header: BlockHeader) {
    this.knownHeaders.delete(header.number)
    this.knownHeaders.set(header.number, header)
    // Evict the least recently inserted headers, which are the lowest blocks
    // once timestamps march forward
    while (this.knownHeaders.size > this.maxKnownHeaders) {
      const oldest = this.knownHeaders.keys().next().value
      if (oldest === undefined) break
      this.knownHeaders.delete(oldest)
    }
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
