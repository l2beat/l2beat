import type { StarkexClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { ChainApi } from '../config/chain/ChainApi'

export interface DayProvider {
  getDailyCount(day: number): Promise<number>
}

export class DayProviders {
  private providers = new Map<string, DayProvider>()

  constructor(chains: ChainApi[], starkexClient?: StarkexClient) {
    if (starkexClient) {
      for (const chain of chains) {
        const starkexApi = chain.blockApis.find((x) => x.type === 'starkex')
        if (starkexApi) {
          this.providers.set(
            chain.name,
            new StarkexDayProvider(starkexClient, starkexApi.product),
          )
        }
      }
    }
  }

  getDayProvider(chain: string) {
    const provider = this.providers.get(chain)
    assert(provider, `DayProvider not found: ${chain}`)
    return provider
  }
}

class StarkexDayProvider implements DayProvider {
  constructor(
    private starkexClient: StarkexClient,
    private products: string[],
  ) {}

  async getDailyCount(day: number): Promise<number> {
    const counts = await Promise.all(
      this.products.map((product) =>
        this.starkexClient.getDailyCount(day, product),
      ),
    )
    return counts.reduce((a, b) => a + b, 0)
  }
}
