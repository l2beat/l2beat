import { INTEROP_CHAINS } from '@l2beat/config'
import type { InteropAggregationConfig } from '../../../../../../config/features/interop'
import { router } from '../../../../../../trpc/init'
import { protectedProcedure } from '../../../../../../trpc/procedures'

type Dependencies = {
  aggregationConfigs: InteropAggregationConfig[]
  aggregationEnabled: boolean
  captureEnabled: boolean
  chains: readonly { id: string; type: 'evm' }[]
  cleanerEnabled: boolean
  compareEnabled: boolean
  configSync: {
    enabled: boolean
    chains: readonly { id: number; name: string }[]
    configIntervalMs: number
  }
  dangerousOperationsEnabled: boolean
  dashboardEnabled: boolean
  financialsEnabled: boolean
  matchingEnabled: boolean
  oneSidedChains: readonly string[]
}

export function createSummaryRouter(deps: Dependencies) {
  return router({
    config: protectedProcedure.query(() => {
      const captureChains = mapChains(deps.chains.map((chain) => chain.id))
      const oneSidedChains = mapChains(deps.oneSidedChains)
      const uniquePluginsCount = new Set(
        deps.aggregationConfigs.flatMap((config) =>
          config.plugins.map((plugin) => plugin.plugin),
        ),
      ).size
      const configsWithDurationSplitCount = deps.aggregationConfigs.filter(
        (config) => config.durationSplit !== undefined,
      ).length

      return {
        featureToggles: {
          capture: deps.captureEnabled,
          matching: deps.matchingEnabled,
          cleaner: deps.cleanerEnabled,
          aggregation: deps.aggregationEnabled,
          dashboard: deps.dashboardEnabled,
          compare: deps.compareEnabled,
          financials: deps.financialsEnabled,
          configSync: deps.configSync.enabled,
          dangerousOperations: deps.dangerousOperationsEnabled,
        },
        capture: {
          enabled: deps.captureEnabled,
          chains: captureChains,
          copyPayload: {
            enabled: deps.captureEnabled,
            chains: deps.chains,
          },
        },
        configSync: deps.configSync,
        oneSided: {
          chains: oneSidedChains,
          copyPayload: deps.oneSidedChains,
        },
        aggregation: {
          enabled: deps.aggregationEnabled,
          configsCount: deps.aggregationConfigs.length,
          uniquePluginsCount,
          configsWithDurationSplitCount,
          copyPayload: deps.aggregationConfigs,
        },
      }
    }),
  })
}

function mapChains(chainIds: readonly string[]) {
  return chainIds.map((chainId) => {
    const configured = INTEROP_CHAINS.find((chain) => chain.id === chainId)
    return {
      id: chainId,
      name: configured?.name ?? chainId,
      display: configured?.display ?? chainId.toUpperCase(),
    }
  })
}
