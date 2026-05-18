import type { InteropAggregationConfig } from '../../../../../../config/features/interop'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

type Dependencies = {
  aggregationEnabled: boolean
  aggregationConfigs: InteropAggregationConfig[]
  captureEnabled: boolean
  chains: readonly { id: string; type: 'evm' }[]
  oneSidedChains: string[]
  matchingEnabled: boolean
  cleanerEnabled: boolean
  dashboardEnabled: boolean
  compareEnabled: boolean
  dangerousOperationsEnabled: boolean
  financialsEnabled: boolean
  tokenDbApiUrl: string
  configSyncEnabled: boolean
  configChains: { id: number; name: string }[]
  configIntervalMs: number
  inMemoryEventCap: number
}

export function createConfigRouter(deps: Dependencies) {
  return router({
    summary: protectedProcedure.query(() => {
      return {
        features: {
          aggregationEnabled: deps.aggregationEnabled,
          captureEnabled: deps.captureEnabled,
          matchingEnabled: deps.matchingEnabled,
          cleanerEnabled: deps.cleanerEnabled,
          dashboardEnabled: deps.dashboardEnabled,
          compareEnabled: deps.compareEnabled,
          dangerousOperationsEnabled: deps.dangerousOperationsEnabled,
          financialsEnabled: deps.financialsEnabled,
          configSyncEnabled: deps.configSyncEnabled,
        },
        aggregation: {
          enabled: deps.aggregationEnabled,
          configs: deps.aggregationConfigs,
        },
        capture: {
          enabled: deps.captureEnabled,
          chains: deps.chains,
        },
        oneSidedChains: deps.oneSidedChains,
        financials: {
          enabled: deps.financialsEnabled,
          tokenDbApiUrl: deps.tokenDbApiUrl,
        },
        configSync: {
          enabled: deps.configSyncEnabled,
          chains: deps.configChains,
          configIntervalMs: deps.configIntervalMs,
        },
        inMemoryEventCap: deps.inMemoryEventCap,
      }
    }),
  })
}
