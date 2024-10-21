import { RpcClient2 } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export class BlockProvider {
  constructor(private readonly clients: RpcClient2[]) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getBlock(x: number): Promise<{
    transactions: unknown[]
    timestamp: number
    number: number
    hash: string
  }> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getBlock(x)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error('Programmer error: Clients should not be empty')
  }
}
