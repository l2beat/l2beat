import { assert, type UnixTime } from '@l2beat/shared-pure'
import {
  AZTEC_MAX_BLOCKS_PER_REQUEST,
  type AztecBlock,
  type AztecBlockClient,
} from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

export class AztecBlockProvider {
  constructor(
    readonly chain: string,
    private readonly clients: AztecBlockClient[],
  ) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getLatestBlockNumber(): Promise<number> {
    return await this.withClient((client) => client.getLatestBlockNumber())
  }

  async getBlocks(start: number, limit: number): Promise<AztecBlock[]> {
    return await this.withClient(async (client) => {
      const blocks: AztecBlock[] = []
      for (
        let offset = 0;
        offset < limit;
        offset += AZTEC_MAX_BLOCKS_PER_REQUEST
      ) {
        const chunkLimit = Math.min(
          AZTEC_MAX_BLOCKS_PER_REQUEST,
          limit - offset,
        )
        blocks.push(...(await client.getBlocks(start + offset, chunkLimit)))
      }
      assert(
        blocks.length === limit,
        `Expected ${limit} blocks starting from ${start}, got ${blocks.length}`,
      )
      for (const [index, block] of blocks.entries()) {
        assert(
          block.number === start + index,
          `Expected block ${start + index}, got ${block.number}`,
        )
      }
      return blocks
    })
  }

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    start = 1,
  ): Promise<number> {
    return await this.withClient(async (client) => {
      const end = await client.getLatestBlockNumber()
      const effectiveStart = start >= end ? 1 : start

      return await getBlockNumberAtOrBefore(
        timestamp,
        effectiveStart,
        end,
        async (number) => {
          const [block] = await client.getBlockHeaders(number, 1)
          assert(block, `Block ${number} not found`)
          assert(
            block.number === number,
            `Expected block ${number}, got ${block.number}`,
          )
          return block
        },
      )
    })
  }

  private async withClient<T>(
    callback: (client: AztecBlockClient) => Promise<T>,
  ): Promise<T> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await callback(client)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing Aztec RPC client for ${this.chain}`)
  }
}
