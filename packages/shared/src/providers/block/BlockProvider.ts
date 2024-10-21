import { assert } from '@l2beat/shared-pure'
import { EVMBlock, RpcClient2 } from '../../clients'

export class BlockProvider {
  constructor(private readonly clients: RpcClient2[]) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getBlockWithTransactions(x: number): Promise<EVMBlock> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getBlockWithTransactions(x)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error('Programmer error: Clients should not be empty')
  }
}
