import { Env } from '@l2beat/backend-tools'
import { chains, tokenList } from '@l2beat/config'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { Config } from './Config'
import { getChainDiscoveryConfig } from './getChainDiscoveryConfig'
import { getChainsWithTokens } from './getChainsWithTokens'
import { getChainTvlConfig } from './getChainTvlConfig'
import { makeConfig } from './makeConfig'

export function getProductionConfig(env: Env): Config {
  const activityProjectsExcludedFromApi = env.optionalString(
    'ACTIVITY_PROJECTS_EXCLUDED_FROM_API',
  )
  const livenessEnabled = env.boolean('LIVENESS_ENABLED', false)
  const updateMonitorEnabled = env.boolean('WATCHMODE_ENABLED', false)
  const diffHistoryEnabled = env.boolean('DIFF_HISTORY_ENABLED', false)
  const discordToken = env.optionalString('DISCORD_TOKEN')
  const publicDiscordChannelId = env.optionalString('PUBLIC_DISCORD_CHANNEL_ID')
  const internalDiscordChannelId = env.optionalString(
    'INTERNAL_DISCORD_CHANNEL_ID',
  )
  const discordEnabled =
    !!discordToken && !!publicDiscordChannelId && !!internalDiscordChannelId
  const finalityEnabled = env.boolean('FINALITY_ENABLED', false)

  return {
    ...makeConfig(env, {
      name: 'Backend/Production',
    }),
    liveness: livenessEnabled && {
      bigQuery: {
        clientEmail: env.string('LIVENESS_CLIENT_EMAIL'),
        privateKey: env.string('LIVENESS_PRIVATE_KEY').replace(/\\n/g, '\n'),
        projectId: env.string('LIVENESS_PROJECT_ID'),
        queryLimitGb: env.integer('LIVENESS_BIGQUERY_LIMIT_GB', 15),
        queryWarningLimitGb: env.integer(
          'LIVENESS_BIGQUERY_WARNING_LIMIT_GB',
          8,
        ),
      },
      minTimestamp: UnixTime.fromDate(new Date('2023-05-01T00:00:00Z')),
    },
    finality: finalityEnabled,
    activity: {
      starkexApiKey: env.string('STARKEX_API_KEY'),
      starkexCallsPerMinute: env.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: false,
      projectsExcludedFromAPI: activityProjectsExcludedFromApi
        ? activityProjectsExcludedFromApi.split(' ')
        : [],
      projects: {
        ethereum: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_ETHEREUM_CALLS'),
          url: env.string('ACTIVITY_ETHEREUM_URL'),
        },
        optimism: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_OPTIMISM_CALLS'),
          url: env.string('ACTIVITY_OPTIMISM_URL'),
        },
        arbitrum: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_ARBITRUM_CALLS'),
          url: env.string('ACTIVITY_ARBITRUM_URL'),
        },
        nova: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_NOVA_CALLS'),
          url: env.string('ACTIVITY_NOVA_URL'),
        },
        linea: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_LINEA_CALLS'),
          url: env.string('ACTIVITY_LINEA_URL'),
        },
        polygonzkevm: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_POLYGONZKEVM_CALLS'),
          url: env.string('ACTIVITY_POLYGONZKEVM_URL'),
        },
        starknet: {
          type: 'starknet',
          callsPerMinute: env.integer('ACTIVITY_STARKNET_CALLS'),
          url: env.string('ACTIVITY_STARKNET_URL'),
        },
        scroll: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_SCROLL_CALLS'),
          url: env.string('ACTIVITY_SCROLL_URL'),
        },
        mantle: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_MANTLE_CALLS', 1500),
          url: env.string('ACTIVITY_MANTLE_URL', 'https://rpc.mantle.xyz'),
        },
        metis: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_METIS_CALLS', 1500),
          url: env.string('ACTIVITY_METIS_URL', 'https://andromeda.metis.io/'),
        },
      },
    },
    statusEnabled: env.boolean('STATUS_ENABLED', true),
    updateMonitor: updateMonitorEnabled && {
      discord: discordEnabled && {
        token: discordToken,
        publicChannelId: publicDiscordChannelId,
        internalChannelId: internalDiscordChannelId,
        callsPerMinute: 3000,
      },
      chains: [
        getChainDiscoveryConfig(env, 'ethereum'),
        getChainDiscoveryConfig(env, 'arbitrum'),
        getChainDiscoveryConfig(env, 'bsc'),
        getChainDiscoveryConfig(env, 'celo'),
        getChainDiscoveryConfig(env, 'gnosis'),
        getChainDiscoveryConfig(env, 'linea'),
        getChainDiscoveryConfig(env, 'optimism'),
        getChainDiscoveryConfig(env, 'polygonpos'),
        getChainDiscoveryConfig(env, 'polygonzkevm'),
      ],
    },
    diffHistory: diffHistoryEnabled && {
      chains: [getChainDiscoveryConfig(env, 'ethereum')],
    },
    chains: chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  }
}
