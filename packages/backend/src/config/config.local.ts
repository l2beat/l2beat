import { bridges, layer2s, tokenList } from '@l2beat/config'
import { EtherscanClient, getEnv, LogLevel } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { config as dotenv } from 'dotenv'

import { bridgeToProject, layer2ToProject } from '../model'
import { getChainMinTimestamp } from './chains'
import { Config } from './Config'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(): Config {
  dotenv()

  const tvlEnabled = getEnv.boolean('TVL_ENABLED', true)
  const detailedTvlEnabled = getEnv.boolean('DETAILED_TVL_ENABLED', false)
  const errorOnUnsyncedDetailedTvl = getEnv.boolean(
    'ERROR_ON_UNSYNCED_DETAILED_TVL',
    false,
  )
  const ethereumTvlEnabled = getEnv.boolean('ETHEREUM_TVL_ENABLED', true)
  const arbitrumTvlEnabled = getEnv.boolean('ARBITRUM_TVL_ENABLED', false)
  const activityEnabled = getEnv.boolean('ACTIVITY_ENABLED', false)
  const updateMonitorEnabled = getEnv.boolean('WATCHMODE_ENABLED', false)
  const discordEnabled =
    !!process.env.DISCORD_TOKEN && !!process.env.INTERNAL_DISCORD_CHANNEL_ID

  return {
    name: 'Backend/Local',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'pretty',
    },
    logThrottler: false,
    clock: {
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: {
      connection: {
        connectionString: getEnv('LOCAL_DB_URL'),
      },
      freshStart: getEnv.boolean('FRESH_START', false),
      connectionPoolSize: {
        // defaults used by knex
        min: 2,
        max: 10,
      },
    },
    api: {
      port: getEnv.integer('PORT', 3000),
    },
    metricsAuth: false,
    health: {
      startedAt: new Date().toISOString(),
      commitSha: getGitCommitHash(),
    },

    tvl: {
      enabled: tvlEnabled,
      detailedTvlEnabled,
      errorOnUnsyncedDetailedTvl,
      coingeckoApiKey: process.env.COINGECKO_API_KEY, // this is optional
      ethereum: ethereumTvlEnabled && {
        providerUrl: getEnv('ETHEREUM_PROVIDER_URL'),
        etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      arbitrum: arbitrumTvlEnabled && {
        arbiscanApiKey: getEnv('ARBISCAN_API_KEY'),
        providerUrl: getEnv('ARBITRUM_PROVIDER_URL'),
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
    },
    activity: activityEnabled && {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexCallsPerMinute: getEnv.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: true,
      projectsExcludedFromAPI: getEnv.array(
        'ACTIVITY_PROJECTS_EXCLUDED_FROM_API',
        [],
      ),
      projects: {
        ethereum: {
          type: 'rpc',
          callsPerMinute: 60,
          url: getEnv(
            'ACTIVITY_ETHEREUM_URL',
            'https://eth-mainnet.alchemyapi.io/v2/demo',
          ),
        },
        optimism: {
          type: 'rpc',
          callsPerMinute: 60,
          url: getEnv('ACTIVITY_OPTIMISM_URL', 'https://mainnet.optimism.io/'),
        },
        arbitrum: {
          type: 'rpc',
          callsPerMinute: 60,
          url: getEnv('ACTIVITY_ARBITRUM_URL', 'https://arb1.arbitrum.io/rpc'),
        },
        zksync2: {
          type: 'rpc',
          callsPerMinute: 60,
        },
        nova: {
          type: 'rpc',
          callsPerMinute: 60,
          url: getEnv('ACTIVITY_NOVA_URL', 'https://nova.arbitrum.io/rpc'),
        },
        linea: {
          type: 'rpc',
          callsPerMinute: 60,
          url: getEnv(
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
          url: getEnv(
            'ACTIVITY_STARKNET_URL',
            'https://starknet-mainnet.public.blastapi.io',
          ),
        },
      },
    },
    statusEnabled: getEnv.boolean('STATUS_ENABLED', true),
    updateMonitor: updateMonitorEnabled && {
      runOnStart: getEnv.boolean('UPDATE_MONITOR_RUN_ON_START', true),
      discord: discordEnabled && {
        token: getEnv('DISCORD_TOKEN'),
        publicChannelId: getEnv.optional('PUBLIC_DISCORD_CHANNEL_ID'),
        internalChannelId: getEnv('INTERNAL_DISCORD_CHANNEL_ID'),
        callsPerMinute: 3000,
      },
      chains: [
        {
          chainId: ChainId.ETHEREUM,
          rpcUrl: getEnv('DISCOVERY_ETHEREUM_RPC_URL'),
          etherscanApiKey: getEnv('DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY'),
          etherscanUrl: EtherscanClient.API_URL,
          minTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
        },
      ],
    },
  }
}
