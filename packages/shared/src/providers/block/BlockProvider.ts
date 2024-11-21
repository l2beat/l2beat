import { assert, Block, UnixTime } from '@l2beat/shared-pure'
import { BlockClient } from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

export class BlockProvider {
  constructor(private readonly clients: BlockClient[]) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getBlockWithTransactions(x: number): Promise<Block> {
    for (const [index, client] of this.clients.entries()) {
      try {
        const block = await client.getBlockWithTransactions(x)
        assert(block.number === x, `Invalid response ${JSON.stringify(block)}`)
        return block
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error('Programmer error: Clients should not be empty')
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

    throw new Error('Programmer error: Clients should not be empty')
  }
}
