import type { Block } from '@l2beat/shared-pure'
import type { BlockClient } from './ChainService'

// Tries each client in turn and keeps using the last one that answered, so a
// dead endpoint costs its retries once rather than on every block.
export class FallbackBlockClient implements BlockClient {
  private preferred = 0

  constructor(private readonly clients: BlockClient[]) {}

  getLatestBlockNumber(): Promise<number> {
    return this.call((client) => client.getLatestBlockNumber())
  }

  getBlockWithTransactions(blockNumber: number): Promise<Block> {
    return this.call((client) => client.getBlockWithTransactions(blockNumber))
  }

  private async call<T>(fn: (client: BlockClient) => Promise<T>): Promise<T> {
    let lastError: unknown
    for (let i = 0; i < this.clients.length; i++) {
      const index = (this.preferred + i) % this.clients.length
      const client = this.clients[index]
      if (!client) continue
      try {
        const result = await fn(client)
        this.preferred = index
        return result
      } catch (error) {
        lastError = error
      }
    }
    throw lastError
  }
}
