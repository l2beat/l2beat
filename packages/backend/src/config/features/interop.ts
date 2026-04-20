import type { Env } from '@l2beat/backend-tools'
import {
  type ChainConfig,
  INTEROP_CHAINS,
  INTEROP_ONE_SIDED_CHAINS,
  type InteropConfig,
  type ProjectService,
} from '@l2beat/config'
import { createRemoteJWKSet } from 'jose'
import type {
  InteropDashboardAuthConfig,
  InteropFeatureConfig,
} from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export interface InteropAggregationConfig extends InteropConfig {
  id: string
}

export async function getInteropFeatureConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
  chains: ChainConfig[],
  activeChains: ChainConfig[],
  isLocal?: boolean,
): Promise<InteropFeatureConfig | false> {
  if (!flags.isEnabled('interop')) {
    return false
  }

  return {
    aggregation: flags.isEnabled('interop', 'aggregation')
      ? { configs: await getInteropAggregationConfigs(ps) }
      : false,
    capture: {
      enabled: flags.isEnabled('interop', 'capture'),
      chains: INTEROP_CHAINS.filter((chain) =>
        flags.isEnabled('interop', 'capture', chain.id),
      ),
    },
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
      auth: isLocal ? false : getInteropDashboardAuthConfig(env),
    },
    compare: {
      enabled: flags.isEnabled('interop', 'compare'),
    },
    financials: {
      enabled: flags.isEnabled('interop', 'financials'),
      tokenDbApiUrl: env.string('TOKEN_BACKEND_TRPC_URL'),
      tokenDbAuthToken: env.optionalString('TOKEN_BACKEND_CF_TOKEN'),
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
    oneSidedChains: [...INTEROP_ONE_SIDED_CHAINS],
  }
}

function getInteropDashboardAuthConfig(env: Env): InteropDashboardAuthConfig {
  const teamDomain = env.string('INTEROP_BACKOFFICE_CF_TEAM_DOMAIN')
  const aud = env.string(['INTEROP_BACKOFFICE_CF_ACCESS_AUD', 'CF_ACCESS_AUD'])

  return {
    JWKS: createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`)),
    aud,
    teamDomain,
  }
}

export async function getInteropAggregationConfigs(
  ps: ProjectService,
): Promise<InteropAggregationConfig[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  return projects.map((p) => ({ ...p.interopConfig, id: p.id }))
}
