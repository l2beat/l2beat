import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, chains, layer2s, tokenList } from '@l2beat/config'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getChainDiscoveryConfig } from './getChainDiscoveryConfig'
import { getChainsWithTokens } from './getChainsWithTokens'
import { getChainTvlConfig } from './getChainTvlConfig'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(env: Env): Config {
  const tvlEnabled = env.boolean('TVL_ENABLED', true)
  const errorOnUnsyncedTvl = env.boolean('ERROR_ON_UNSYNCED_TVL', false)
  const activityEnabled = env.boolean('ACTIVITY_ENABLED', false)
  const activityProjectsExcludedFromApi = env.optionalString(
    'ACTIVITY_PROJECTS_EXCLUDED_FROM_API',
  )
  const livenessEnabled = env.boolean('LIVENESS_ENABLED', false)
  const updateMonitorEnabled = env.boolean('WATCHMODE_ENABLED', false)
  const diffHistoryEnabled = env.boolean('DIFF_HISTORY_ENABLED', false)
  const discordToken = env.optionalString('DISCORD_TOKEN')
  const internalDiscordChannelId = env.optionalString(
    'INTERNAL_DISCORD_CHANNEL_ID',
  )
  const discordEnabled = !!discordToken && !!internalDiscordChannelId
  const finalityEnabled = env.boolean('FINALITY_ENABLED', false)

  // TODO: This should probably be configurable
  const minTimestamp = UnixTime.now().add(-7, 'days').toStartOf('hour')

  return {
    name: 'Backend/Local',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
      format: 'pretty',
      colors: true,
    },
    logThrottler: false,
    clock: {
      minBlockTimestamp: minTimestamp,
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: {
      connection: env.string('LOCAL_DB_URL'),
      freshStart: env.boolean('FRESH_START', false),
      connectionPoolSize: {
        // defaults used by knex
        min: 2,
        max: 10,
      },
    },
    api: {
      port: env.integer('PORT', 3000),
    },
    metricsAuth: false,
    health: {
      startedAt: new Date().toISOString(),
      commitSha: getGitCommitHash(),
    },
    tvl: {
      enabled: tvlEnabled,
      errorOnUnsyncedTvl,
      coingeckoApiKey: env.optionalString('COINGECKO_API_KEY'),
      ethereum: getChainTvlConfig(env, 'ethereum', { minTimestamp }),
      modules: getChainsWithTokens(tokenList, chains).map((x) =>
        getChainTvlConfig(env, x),
      ),
    },
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
      // TODO: figure out how to set it for local development
      minTimestamp: UnixTime.fromDate(new Date('2023-05-01T00:00:00Z')),
    },
    finality: finalityEnabled,
    activity: activityEnabled && {
      starkexApiKey: env.string('STARKEX_API_KEY'),
      starkexCallsPerMinute: env.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: true,
      projectsExcludedFromAPI: activityProjectsExcludedFromApi
        ? activityProjectsExcludedFromApi.split(' ')
        : [],

      projects: {
        ethereum: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_ETHEREUM_URL',
            'https://eth-mainnet.alchemyapi.io/v2/demo',
          ),
        },
        optimism: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_OPTIMISM_URL',
            'https://mainnet.optimism.io/',
          ),
        },
        arbitrum: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_ARBITRUM_URL',
            'https://arb1.arbitrum.io/rpc',
          ),
        },
        zksync2: {
          type: 'rpc',
          callsPerMinute: 60,
        },
        nova: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string('ACTIVITY_NOVA_URL', 'https://nova.arbitrum.io/rpc'),
        },
        linea: {
          type: 'rpc',
          callsPerMinute: 60,
          url: env.string(
            'ACTIVITY_LINEA_URL',
            'https://linea-mainnet.infura.io/v3',
          ),
        },
        polygonzkevm: {
          type: 'rpc',
          callsPerMinute: 500,
          url: 'https://polygon-rpc.com/zkevm',
        },
        starknet: {
          type: 'starknet',
          callsPerMinute: 120,
          url: env.string(
            'ACTIVITY_STARKNET_URL',
            'https://starknet-mainnet.public.blastapi.io',
          ),
        },
        scroll: {
          type: 'rpc',
          callsPerMinute: 120,
          url: env.string('ACTIVITY_SCROLL_URL', 'https://rpc.scroll.io'),
        },
        mantle: {
          type: 'rpc',
          callsPerMinute: 120,
          url: env.string('ACTIVITY_MANTLE_URL', 'https://rpc.mantle.xyz'),
        },
        metis: {
          type: 'rpc',
          callsPerMinute: 120,
          url: env.string('ACTIVITY_METIS_URL', 'https://andromeda.metis.io/'),
        },
      },
    },
    statusEnabled: env.boolean('STATUS_ENABLED', true),
    updateMonitor: updateMonitorEnabled && {
      runOnStart: env.boolean('UPDATE_MONITOR_RUN_ON_START', true),
      discord: discordEnabled && {
        token: discordToken,
        publicChannelId: env.optionalString('PUBLIC_DISCORD_CHANNEL_ID'),
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
