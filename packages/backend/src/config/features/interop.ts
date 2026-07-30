import type { Env } from '@l2beat/backend-tools'
import {
  type ChainConfig,
  INTEROP_CHAINS,
  INTEROP_ONE_SIDED_CHAINS,
  type InteropConfig,
  type ProjectService,
} from '@l2beat/config'
import type { InteropFeatureConfig, InteropPromotionConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export type InteropAggregationConfig = InteropConfig & {
  id: string
}

function parsePromotionMode(value: string): InteropPromotionConfig['mode'] {
  if (value === 'off' || value === 'shadow' || value === 'enforce') {
    return value
  }
  throw new Error(
    `Invalid INTEROP_PROMOTION_MODE "${value}" (expected off | shadow | enforce)`,
  )
}

export async function getInteropFeatureConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
  chains: ChainConfig[],
  activeChains: ChainConfig[],
): Promise<InteropFeatureConfig | false> {
  if (!flags.isEnabled('interop')) {
    return false
  }

  return {
    aggregation: flags.isEnabled('interop', 'aggregation')
      ? {
          configs: await getInteropAggregationConfigs(ps),
          promotion: {
            mode: parsePromotionMode(
              env.string('INTEROP_PROMOTION_MODE', 'shadow'),
            ),
            failClosed: env.boolean('INTEROP_PROMOTION_FAIL_CLOSED', true),
            maxLaneVolumeUsd: env.integer(
              'INTEROP_PROMOTION_MAX_LANE_VOLUME_USD',
              1_000_000_000,
            ),
          },
        }
      : false,
    capture: {
      enabled: flags.isEnabled('interop', 'capture'),
      chains: INTEROP_CHAINS.filter((chain) =>
        flags.isEnabled('interop', 'capture', chain.id),
      ),
    },
    knownChains: INTEROP_CHAINS.map((chain) => chain.id),
    matching: flags.isEnabled('interop', 'matching'),
    cleaner: flags.isEnabled('interop', 'cleaner'),
    dangerousOperationsEnabled: env.boolean(
      'INTEROP_DANGEROUS_OPERATIONS_ENABLED',
      false,
    ),
    dashboard: {
      enabled: flags.isEnabled('interop', 'dashboard'),
      getExplorerUrl: (chain: string) => {
        const c = chains.find(
          (configuredChain) => configuredChain.name === chain,
        )
        return c?.explorerUrl
      },
    },
    compare: {
      enabled: flags.isEnabled('interop', 'compare'),
    },
    financials: {
      enabled: flags.isEnabled('interop', 'financials'),
      tokenDbApiUrl: env.string('TOKEN_BACKEND_TRPC_URL'),
      tokenDbAuthToken: env.optionalString('TOKEN_BACKEND_CF_TOKEN'),
      maxTokenPriceUsd: env.integer(
        'INTEROP_FINANCIALS_MAX_TOKEN_PRICE_USD',
        1_000_000,
      ),
      maxTransferValueUsd: env.integer(
        'INTEROP_FINANCIALS_MAX_TRANSFER_VALUE_USD',
        1_000_000_000,
      ),
      batchSize: env.integer('INTEROP_FINANCIALS_BATCH_SIZE', 10_000),
    },
    config: {
      enabled: flags.isEnabled('interop', 'config'),
      chains: activeChains
        .filter((chain) => chain.chainId !== undefined)
        .map((chain) => ({ id: chain.chainId as number, name: chain.name })),
      configIntervalMs: env.integer(
        'INTEROP_CONFIG_INTERVAL_MS',
        12 * 60 * 60 * 1000, // 12 hours
      ),
    },
    inMemoryEventCap: env.integer('INTEROP_EVENT_CAP', 500_000),
    oneSidedChains: [
      ...INTEROP_ONE_SIDED_CHAINS.filter((chain) =>
        flags.isEnabled('interop', 'oneSidedChain', chain),
      ),
    ],
  }
}

export async function getInteropAggregationConfigs(
  ps: ProjectService,
): Promise<InteropAggregationConfig[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  return projects.map((p) => ({ ...p.interopConfig, id: p.id }))
}
