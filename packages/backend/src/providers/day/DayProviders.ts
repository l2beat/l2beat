import type {
  LighterClient,
  StarkexClient,
  VoyagerClient,
} from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { ChainApi } from '../../config/chain/ChainApi'
import { LighterDayProvider } from './LighterDayProvider'
import { StarkexDayProvider } from './StarkexDayProvider'
import { StarknetDayProvider } from './StarknetDayProvider'

interface DayProvidersClients {
  starkex: StarkexClient | undefined
  voyager: VoyagerClient | undefined
  lighter: LighterClient | undefined
}

export type DayProvider = DailyCountsProvider | HourlyCountsProvider

export interface DailyCountsProvider {
  getDailyTxsCount(from: number, to: number): Promise<Record<number, number>>
  getDailyUopsCount(from: number, to: number): Promise<Record<number, number>>
}

/** For sources that count by the hour. Their days are the sums of the hours */
export interface HourlyCountsProvider {
  /** Those from `from` to `to` (exclusive) */
  getHourlyCounts(from: UnixTime, to: UnixTime): Promise<HourlyCount[]>
}

export interface HourlyCount {
  timestamp: UnixTime
  count: number
  uopsCount: number
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
    if (clients.voyager) {
      this.providers.set('starknet', new StarknetDayProvider(clients.voyager))
    }
    if (clients.lighter) {
      this.providers.set('lighter', new LighterDayProvider(clients.lighter))
    }
  }

  getDayProvider(chain: string) {
    const provider = this.providers.get(chain)
    assert(provider, `DayProvider not found: ${chain}`)
    return provider
  }
}
