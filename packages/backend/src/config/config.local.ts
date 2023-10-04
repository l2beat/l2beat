import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, layer2s, tokenList } from '@l2beat/config'
import { EtherscanClient } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { getChainMinTimestamp } from './chains'
import { Config } from './Config'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(env: Env): Config {
  const tvlEnabled = env.boolean('TVL_ENABLED', true)
  const errorOnUnsyncedDetailedTvl = env.boolean(
    'ERROR_ON_UNSYNCED_DETAILED_TVL',
    false,
  )
  const ethereumTvlEnabled = env.boolean('TVL_ETHEREUM_ENABLED', true)
  const arbitrumTvlEnabled = env.boolean('TVL_ARBITRUM_ENABLED', false)
  const optimismTvlEnabled = env.boolean('TVL_OPTIMISM_ENABLED', false)
  const baseTvlEnabled = env.boolean('TVL_BASE_ENABLED', false)
  const activityEnabled = env.boolean('ACTIVITY_ENABLED', false)
  const activityProjectsExcludedFromApi = env.optionalString(
    'ACTIVITY_PROJECTS_EXCLUDED_FROM_API',
  )

  const updateMonitorEnabled = env.boolean('WATCHMODE_ENABLED', false)
  const discordToken = env.optionalString('DISCORD_TOKEN')
  const internalDiscordChannelId = env.optionalString(
    'INTERNAL_DISCORD_CHANNEL_ID',
  )
  const discordEnabled = !!discordToken && !!internalDiscordChannelId

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
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
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
      errorOnUnsyncedDetailedTvl,
      coingeckoApiKey: env.optionalString('COINGECKO_API_KEY'),
      ethereum: ethereumTvlEnabled && {
        providerUrl: env.string('TVL_ETHEREUM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_ETHEREUM_RPC_CALLS_PER_MINUTE',
          25,
        ),
        etherscanApiKey:
          env.optionalString('ETHEREUM_ETHERSCAN_API_KEY') ??
          env.string('TVL_ETHEREUM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.etherscan.io/api',
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      arbitrum: arbitrumTvlEnabled && {
        providerUrl: env.string('TVL_ARBITRUM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_ARBITRUM_RPC_CALLS_PER_MINUTE',
          25,
        ),
        etherscanApiKey: env.string('TVL_ARBITRUM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.arbiscan.io/api',
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      optimism: optimismTvlEnabled && {
        providerUrl: env.string('TVL_OPTIMISM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_OPTIMISM_RPC_CALLS_PER_MINUTE',
          25,
        ),
        etherscanApiKey: env.string('TVL_OPTIMISM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api-optimistic.etherscan.io/api',
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      base: baseTvlEnabled && {
        providerUrl: env.string('TVL_BASE_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_BASE_RPC_CALLS_PER_MINUTE',
          25,
        ),
        etherscanApiKey: env.string('TVL_BASE_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.basescan.org/api',
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
    },
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
        {
          chainId: ChainId.ETHEREUM,
          rpcUrl: env.string('DISCOVERY_ETHEREUM_RPC_URL'),
          etherscanApiKey: env.string('DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY'),
          etherscanUrl: EtherscanClient.API_URL,
          minTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
        },
      ],
    },
  }
}
