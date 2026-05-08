import { assert, type Block, UnixTime } from '@l2beat/shared-pure'
import type { BlockClient } from '../../clients'
import { RpcClient } from '../../clients/rpc/RpcClient'
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

  async getBlock(
    x: number | 'latest',
  ): Promise<{ number: number; timestamp: number; hash: string }> {
    for (const [index, client] of this.clients.entries()) {
      try {
        const clientWithGetBlock = client as BlockClient & {
          getBlock(
            blockNumber: number | 'latest',
            includeTxs: false,
          ): Promise<{ number: number; timestamp: number; hash: string }>
        }
        if (clientWithGetBlock.getBlock) {
          const block = await clientWithGetBlock.getBlock(x, false)
          if (typeof x === 'number') {
            assert(
              block.number === x,
              `Invalid response: expected block number ${x}, got ${block.number}`,
            )
          }
          return block
        }

        const block = await client.getBlockWithTransactions(x)
        if (typeof x === 'number') {
          assert(
            block.number === x,
            `Invalid response: expected block number ${x}, got ${block.number}`,
          )
        }
        return {
          number: block.number,
          timestamp: block.timestamp,
          hash: block.hash,
        }
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
        if (client instanceof RpcClient) {
          const timestamps = await client.getBlockTimestamps(blockNumbers)
          const out = new Map<number, UnixTime>()
          for (const [n, ts] of timestamps) {
            out.set(n, UnixTime(ts))
          }
          return out
        }

        const out = new Map<number, UnixTime>()
        for (const n of blockNumbers) {
          const block = await this.getBlock(n)
          out.set(block.number, UnixTime(block.timestamp))
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
