import { bridges, layer2s, tokenList } from '@l2beat/config'
import { EtherscanClient, getEnv, LogLevel } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { getChainMinTimestamp } from './chains'
import { Config } from './Config'
import { getGitCommitHash } from './getGitCommitHash'

export function getProductionConfig(): Config {
  const arbitrumTvlEnabled = getEnv.boolean('ARBITRUM_TVL_ENABLED', false)
  const optimismTvlEnabled = getEnv.boolean('OPTIMISM_TVL_ENABLED', false)
  const baseTvlEnabled = getEnv.boolean('BASE_TVL_ENABLED', false)
  const detailedTvlEnabled = getEnv.boolean('DETAILED_TVL_ENABLED', false)
  const errorOnUnsyncedDetailedTvl = getEnv.boolean(
    'ERROR_ON_UNSYNCED_DETAILED_TVL',
    false,
  )

  const updateMonitorEnabled = getEnv.boolean('WATCHMODE_ENABLED', false)
  const discordEnabled =
    !!process.env.DISCORD_TOKEN &&
    !!process.env.PUBLIC_DISCORD_CHANNEL_ID &&
    !!process.env.INTERNAL_DISCORD_CHANNEL_ID

  return {
    name: 'Backend/Production',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    tokens: tokenList,
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'json',
    },
    logThrottler: {
      threshold: 4,
      thresholdTimeInMs: 5000,
      throttleTimeInMs: 20000,
    },
    clock: {
      minBlockTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
      safeTimeOffsetSeconds: 60 * 60,
    },
    database: {
      freshStart: false,
      connection: {
        connectionString: getEnv('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
      },
      connectionPoolSize: {
        // our heroku plan allows us for up to 400 open connections
        min: 20,
        max: 200,
      },
    },
    api: {
      port: getEnv.integer('PORT'),
    },
    health: {
      releasedAt: getEnv('HEROKU_RELEASE_CREATED_AT', ''),
      startedAt: new Date().toISOString(),
      commitSha: getEnv('HEROKU_SLUG_COMMIT', getGitCommitHash()),
    },
    metricsAuth: {
      user: getEnv('METRICS_AUTH_USER'),
      pass: getEnv('METRICS_AUTH_PASS'),
    },
    tvl: {
      detailedTvlEnabled,
      errorOnUnsyncedDetailedTvl,
      enabled: true,
      coingeckoApiKey: getEnv('COINGECKO_API_KEY'),
      ethereum: {
        providerUrl: getEnv('ETHEREUM_PROVIDER_URL'),
        providerCallsPerMinute: getEnv.integer(
          'TVL_ETHEREUM_RPC_CALLS_PER_MINUTE ',
          500,
        ),
        // TODO: phase out old env variable
        etherscanApiKey:
          process.env.ETHEREUM_ETHERSCAN_API_KEY ?? getEnv('ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.etherscan.io/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.ETHEREUM),
      },
      arbitrum: arbitrumTvlEnabled && {
        providerUrl: getEnv('ARBITRUM_PROVIDER_URL'),
        providerCallsPerMinute: getEnv.integer(
          'TVL_ARBITRUM_RPC_CALLS_PER_MINUTE ',
          500,
        ),
        etherscanApiKey: getEnv('ARBITRUM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.arbiscan.io/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.ARBITRUM),
      },
      optimism: optimismTvlEnabled && {
        providerUrl: getEnv('OPTIMISM_PROVIDER_URL'),
        providerCallsPerMinute: getEnv.integer(
          'TVL_OPTIMISM_RPC_CALLS_PER_MINUTE ',
          500,
        ),
        etherscanApiKey: getEnv('OPTIMISM_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api-optimistic.etherscan.io/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.OPTIMISM),
      },
      base: baseTvlEnabled && {
        providerUrl: getEnv('BASE_PROVIDER_URL'),
        providerCallsPerMinute: getEnv.integer(
          'TVL_BASE_RPC_CALLS_PER_MINUTE ',
          500,
        ),
        etherscanApiKey: getEnv('BASE_ETHERSCAN_API_KEY'),
        etherscanApiUrl: 'https://api.basescan.org/api',
        minBlockTimestamp: getChainMinTimestamp(ChainId.BASE),
      },
    },
    activity: {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexCallsPerMinute: getEnv.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: false,
      projectsExcludedFromAPI: getEnv.array(
        'ACTIVITY_PROJECTS_EXCLUDED_FROM_API',
        [],
      ),
      projects: {
        ethereum: {
          type: 'rpc',
          callsPerMinute: getEnv.integer('ACTIVITY_ETHEREUM_CALLS'),
          url: getEnv('ACTIVITY_ETHEREUM_URL'),
        },
        optimism: {
          type: 'rpc',
          callsPerMinute: getEnv.integer('ACTIVITY_OPTIMISM_CALLS'),
          url: getEnv('ACTIVITY_OPTIMISM_URL'),
        },
        arbitrum: {
          type: 'rpc',
          callsPerMinute: getEnv.integer('ACTIVITY_ARBITRUM_CALLS'),
          url: getEnv('ACTIVITY_ARBITRUM_URL'),
        },
        nova: {
          type: 'rpc',
          callsPerMinute: getEnv.integer('ACTIVITY_NOVA_CALLS'),
          url: getEnv('ACTIVITY_NOVA_URL'),
        },
        linea: {
          type: 'rpc',
          callsPerMinute: getEnv.integer('ACTIVITY_LINEA_CALLS'),
          url: getEnv('ACTIVITY_LINEA_URL'),
        },
        polygonzkevm: {
          type: 'rpc',
          callsPerMinute: getEnv.integer('ACTIVITY_POLYGONZKEVM_CALLS'),
          url: getEnv('ACTIVITY_POLYGONZKEVM_URL'),
        },
        starknet: {
          type: 'starknet',
          callsPerMinute: getEnv.integer('ACTIVITY_STARKNET_CALLS'),
          url: getEnv('ACTIVITY_STARKNET_URL'),
        },
      },
    },
    statusEnabled: getEnv.boolean('STATUS_ENABLED', true),
    updateMonitor: updateMonitorEnabled && {
      discord: discordEnabled && {
        token: getEnv('DISCORD_TOKEN'),
        publicChannelId: getEnv('PUBLIC_DISCORD_CHANNEL_ID'),
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
