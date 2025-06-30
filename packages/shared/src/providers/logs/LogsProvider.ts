import { assert, type Log } from '@l2beat/shared-pure'
import type { LogsClient } from '../../clients'

export class LogsProvider {
  constructor(
    readonly chain: string,
    private readonly clients: LogsClient[],
  ) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: string[],
  ): Promise<Log[]> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getLogs(from, to, addresses, topics)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing ${this.chain} log client`)
  }
}
