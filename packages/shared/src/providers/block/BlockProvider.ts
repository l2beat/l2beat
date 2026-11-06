import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type {
  BlockClient,
  BlockHeader,
  TransactionReceipt,
} from '../../clients'
import {
  type BlockNumberAtOrBeforeOptions,
  getBlockNumberAtOrBefore,
} from '../../tools/getBlockNumberAtOrBefore'

export class BlockProvider {
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
      if (typeof x === 'number') {
        assert(
          block.number === x,
          `Invalid response: expected block number ${x}, got ${block.number}`,
        )
      }
      return block
    })
  }

  async getBlockHeader(x: number | 'latest'): Promise<BlockHeader> {
    return await this.withClient(async (client) => {
      const block = await client.getBlockHeader(x)
      if (typeof x === 'number' && block.number !== x) {
        throw new Error('Invalid response: unexpected block number', {
          cause: { expected: x, received: block.number },
        })
      }
      return { number: block.number, timestamp: block.timestamp }
    })
  }

  async getBlockTimestamp(blockNumber: number): Promise<UnixTime> {
    const block = await this.getBlockHeader(blockNumber)
    return UnixTime(block.timestamp)
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

  async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    return await this.withClient(async (client) => {
      assert(
        client.getTransactionReceipt,
        'Client does not support fetching transaction receipts',
      )
      return await client.getTransactionReceipt(txHash)
    })
  }

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    start = 1,
    options?: BlockNumberAtOrBeforeOptions,
  ): Promise<number> {
    return await this.withClient(async (client) => {
      const end = await client.getLatestBlockNumber()
      const effectiveStart = start >= end ? 1 : start

      return await getBlockNumberAtOrBefore(
        timestamp,
        effectiveStart,
        end,
        (number: number) => client.getBlockHeader(number),
        options,
      )
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
