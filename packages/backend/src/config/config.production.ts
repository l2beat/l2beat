import { Env, LoggerOptions } from '@l2beat/backend-tools'
import { bridges, layer2s, tokenList } from '@l2beat/config'
import { multicallConfig } from '@l2beat/discovery'
import { EtherscanClient } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { getChainMinTimestamp } from './chains'
import { Config } from './Config'
import { getGitCommitHash } from './getGitCommitHash'

export function getProductionConfig(env: Env): Config {
  const arbitrumTvlEnabled = env.boolean('TVL_ARBITRUM_ENABLED', false)
  const optimismTvlEnabled = env.boolean('TVL_OPTIMISM_ENABLED', false)
  const baseTvlEnabled = env.boolean('TVL_BASE_ENABLED', false)
  const errorOnUnsyncedTvl = env.boolean('ERROR_ON_UNSYNCED_TVL', false)
  const activityProjectsExcludedFromApi = env.optionalString(
    'ACTIVITY_PROJECTS_EXCLUDED_FROM_API',
  )
  const livenessEnabled = env.boolean('LIVENESS_ENABLED', false)
  const updateMonitorEnabled = env.boolean('WATCHMODE_ENABLED', false)
  const discordToken = env.optionalString('DISCORD_TOKEN')
  const publicDiscordChannelId = env.optionalString('PUBLIC_DISCORD_CHANNEL_ID')
  const internalDiscordChannelId = env.optionalString(
    'INTERNAL_DISCORD_CHANNEL_ID',
  )
  const discordEnabled =
    !!discordToken && !!publicDiscordChannelId && !!internalDiscordChannelId

  return {
    name: 'Backend/Production',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: env.string('LOG_LEVEL', 'INFO') as LoggerOptions['logLevel'],
      format: 'json',
      utc: true,
    },
    logThrottler: {
      callsUntilThrottle: 4,
      clearIntervalMs: 5000,
      throttleTimeMs: 20000,
    },
    clock: {
      minBlockTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: {
      freshStart: false,
      connection: {
        connectionString: env.string('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
      },
      connectionPoolSize: {
        // our heroku plan allows us for up to 400 open connections
        min: 20,
        max: 200,
      },
    },
    api: {
      port: env.integer('PORT'),
    },
    health: {
      releasedAt: env.string('HEROKU_RELEASE_CREATED_AT', ''),
      startedAt: new Date().toISOString(),
      commitSha: env.string('HEROKU_SLUG_COMMIT', getGitCommitHash()),
    },
    metricsAuth: {
      user: env.string('METRICS_AUTH_USER'),
      pass: env.string('METRICS_AUTH_PASS'),
    },
    tvl: {
      errorOnUnsyncedTvl,
      enabled: true,
      coingeckoApiKey: env.string('COINGECKO_API_KEY'),
      ethereum: {
        providerUrl: env.string('TVL_ETHEREUM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_ETHEREUM_RPC_CALLS_PER_MINUTE',
          500,
        ),
        // TODO: phase out old env variable
        etherscanApiKey:
          env.optionalString('ETHEREUM_ETHERSCAN_API_KEY') ??
          env.string('TVL_ETHEREUM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.etherscan.io/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
      },
      arbitrum: arbitrumTvlEnabled && {
        providerUrl: env.string('TVL_ARBITRUM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_ARBITRUM_RPC_CALLS_PER_MINUTE',
          500,
        ),
        etherscanApiKey: env.string('TVL_ARBITRUM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.arbiscan.io/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.ARBITRUM),
      },
      optimism: optimismTvlEnabled && {
        providerUrl: env.string('TVL_OPTIMISM_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_OPTIMISM_RPC_CALLS_PER_MINUTE',
          500,
        ),
        etherscanApiKey: env.string('TVL_OPTIMISM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api-optimistic.etherscan.io/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.OPTIMISM),
      },
      base: baseTvlEnabled && {
        providerUrl: env.string('TVL_BASE_PROVIDER_URL'),
        providerCallsPerMinute: env.integer(
          'TVL_BASE_RPC_CALLS_PER_MINUTE',
          500,
        ),
        etherscanApiKey: env.string('TVL_BASE_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.basescan.org/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.BASE),
      },
    },
    liveness: livenessEnabled && {
      bigQuery: {
        clientEmail: env.string('LIVENESS_CLIENT_EMAIL'),
        privateKey: env.string('LIVENESS_PRIVATE_KEY').replace(/\\n/g, '\n'),
        projectId: env.string('LIVENESS_PROJECT_ID'),
      },
    },
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
        {
          chainId: ChainId.ETHEREUM,
          rpcUrl: env.string('DISCOVERY_ETHEREUM_RPC_URL'),
          rpcGetLogsMaxRange: env.optionalInteger(
            'DISCOVERY_ETHEREUM_RPC_GETLOGS_MAX_RANGE',
          ),
          multicall: multicallConfig.ethereum,
          etherscanApiKey: env.string('DISCOVERY_ETHEREUM_ETHERSCAN_API_KEY'),
          etherscanUrl: EtherscanClient.API_URL,
          minTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
        },
      ],
    },
  }
}
