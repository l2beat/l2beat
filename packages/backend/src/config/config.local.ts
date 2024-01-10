import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, layer2s, tokenList } from '@l2beat/config'
import { getChainConfig } from '@l2beat/discovery'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(env: Env): Config {
  const tvlEnabled = env.boolean('TVL_ENABLED', true)
  const errorOnUnsyncedTvl = env.boolean('ERROR_ON_UNSYNCED_TVL', false)
  const ethereumTvlEnabled = env.boolean('TVL_ETHEREUM_ENABLED', true)
  const arbitrumTvlEnabled = env.boolean('TVL_ARBITRUM_ENABLED', false)
  const optimismTvlEnabled = env.boolean('TVL_OPTIMISM_ENABLED', false)
  const baseTvlEnabled = env.boolean('TVL_BASE_ENABLED', false)
  const lyraTvlEnabled = env.boolean('TVL_LYRA_ENABLED', false)
  const lineaTvlEnabled = env.boolean('TVL_LINEA_ENABLED', false)
  const mantapacificTvlEnabled = env.boolean('TVL_MANTA_PACIFIC_ENABLED', false)
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
  const errorReportingEnabled = !!env.optionalString('BUGSNAG_API_KEY')

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
      errorOnUnsyncedTvl,
      coingeckoApiKey: env.optionalString('COINGECKO_API_KEY'),
      ethereum: ethereumTvlEnabled && {
        providerUrl: env.string('TVL_ETHEREUM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_ETHEREUM_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'EtherscanLike',
          etherscanApiKey:
            env.optionalString('ETHEREUM_ETHERSCAN_API_KEY') ??
            env.string('TVL_ETHEREUM_ETHERSCAN_API_KEY'),
          etherscanApiUrl: 'https://api.etherscan.io/api',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      arbitrum: arbitrumTvlEnabled && {
        providerUrl: env.string('TVL_ARBITRUM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_ARBITRUM_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'EtherscanLike',
          etherscanApiKey: env.string('TVL_ARBITRUM_ETHERSCAN_API_KEY'),
          etherscanApiUrl: 'https://api.arbiscan.io/api',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      optimism: optimismTvlEnabled && {
        providerUrl: env.string('TVL_OPTIMISM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_OPTIMISM_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'EtherscanLike',
          etherscanApiKey: env.string('TVL_OPTIMISM_ETHERSCAN_API_KEY'),
          etherscanApiUrl: 'https://api-optimistic.etherscan.io/api',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      base: baseTvlEnabled && {
        providerUrl: env.string('TVL_BASE_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_BASE_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'EtherscanLike',
          etherscanApiKey: env.string('TVL_BASE_ETHERSCAN_API_KEY'),
          etherscanApiUrl: 'https://api.basescan.org/api',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      linea: lineaTvlEnabled && {
        providerUrl: env.string('TVL_LINEA_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_LINEA_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'EtherscanLike',
          etherscanApiKey: env.string('TVL_LINEA_ETHERSCAN_API_KEY'),
          etherscanApiUrl: 'https://api.lineascan.build/api',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      lyra: lyraTvlEnabled && {
        providerUrl: env.string('TVL_LYRA_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_LYRA_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'RoutescanLike',
          routescanApiUrl: 'https://explorer.lyra.finance/api',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
      mantapacific: mantapacificTvlEnabled && {
        providerUrl: env.string('TVL_MANTA_PACIFIC_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_MANTA_PACIFIC_RPC_CALLS_PER_MINUTE',
          25,
        ),
        blockNumberProviderConfig: {
          type: 'RoutescanLike',
          routescanApiUrl: 'https://pacific-explorer.manta.network/aapi',
        },
        minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      },
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
          ...getChainConfig(ChainId.ETHEREUM),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_ETHEREUM_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.ARBITRUM),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_ARBITRUM_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.AVALANCHE),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_AVALANCHE_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.BSC),
          reorgSafeDepth: env.optionalInteger('DISCOVERY_BSC_REORG_SAFE_DEPTH'),
        },
        {
          ...getChainConfig(ChainId.CELO),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_CELO_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.GNOSIS),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_GNOSIS_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.LINEA),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_LINEA_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.OPTIMISM),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_OPTIMISM_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.POLYGON_POS),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_POLYGON_POS_REORG_SAFE_DEPTH',
          ),
        },
        {
          ...getChainConfig(ChainId.POLYGON_ZKEVM),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_POLYGON_ZKEVM_REORG_SAFE_DEPTH',
          ),
        },
      ],
    },
    diffHistory: diffHistoryEnabled && {
      chains: [
        {
          ...getChainConfig(ChainId.ETHEREUM),
          reorgSafeDepth: env.optionalInteger(
            'DISCOVERY_ETHEREUM_REORG_SAFE_DEPTH',
          ),
        },
      ],
    },
    errorReporting: errorReportingEnabled && {
      bugsnagApiKey: env.string('BUGSNAG_API_KEY'),
      environment: 'local',
    },
  }
}
