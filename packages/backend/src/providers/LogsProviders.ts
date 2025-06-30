import { type LogsClient, LogsProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

export class LogsProviders {
  logsProviders: Map<string, LogsProvider> = new Map()

  constructor(clients: LogsClient[]) {
    const byChain = groupBy(clients, (c) => c.chain)
    for (const [chain, clients] of Object.entries(byChain)) {
      const block = new LogsProvider(chain, clients)
      this.logsProviders.set(chain, block)
    }
  }

  getLogsProvider(chain: string) {
    const provider = this.logsProviders.get(chain)
    assert(provider, `LogsProvider not found: ${chain}`)
    return provider
  }
}
