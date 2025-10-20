import type { StarkexClient, VoyagerClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { ChainApi } from '../../config/chain/ChainApi'
import { StarkexDayProvider } from './StarkexDayProvider'
import { StarknetDayProvider } from './StarknetDayProvider'

interface DayProvidersClients {
  starkex: StarkexClient | undefined
  voyager: VoyagerClient
}

export interface DayProvider {
  getDailyTxs(from: number, to: number): Promise<Record<number, number>>
  getDailyUops(from: number, to: number): Promise<Record<number, number>>
}

export class DayProviders {
  private providers = new Map<string, DayProvider>()

  constructor(chains: ChainApi[], clients: DayProvidersClients) {
    if (clients.starkex) {
      for (const chain of chains) {
        const starkexApi = chain.blockApis.find((x) => x.type === 'starkex')
        if (starkexApi) {
          this.providers.set(
            chain.name,
            new StarkexDayProvider(clients.starkex, starkexApi.product),
          )
        }
      }
    }
    this.providers.set('starknet', new StarknetDayProvider(clients.voyager))
  }

  getDayProvider(chain: string) {
    const provider = this.providers.get(chain)
    assert(provider, `DayProvider not found: ${chain}`)
    return provider
  }
}
