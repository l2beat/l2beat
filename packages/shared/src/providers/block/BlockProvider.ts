import { assert, Block, UnixTime } from '@l2beat/shared-pure'
import { BlockClient } from '../../clients/types'

export class BlockProvider {
  constructor(private readonly clients: BlockClient[]) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getBlockWithTransactions(x: number): Promise<Block> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getBlockWithTransactions(x)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error('Programmer error: Clients should not be empty')
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getBlockNumberAtOrBefore(timestamp)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error('Programmer error: Clients should not be empty')
  }
}
