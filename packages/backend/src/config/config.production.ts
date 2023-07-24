import { bridges, layer2s, tokenList } from '@l2beat/config'
import { getEnv, LogLevel } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getGitCommitHash } from './getGitCommitHash'

export function getProductionConfig(): Config {
  const arbitrumTvlEnabled = getEnv.boolean('ARBITRUM_TVL_ENABLED', false)

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
      minBlockTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
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
      enabled: true,
      coingeckoApiKey: getEnv('COINGECKO_API_KEY'),
      ethereum: {
        alchemyApiKey: getEnv('ETHEREUM_ALCHEMY_API_KEY'),
        etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
        // Deployment of the first L2
        minBlockTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
      },
      arbitrum: arbitrumTvlEnabled && {
        arbiscanApiKey: getEnv('ARBISCAN_API_KEY'),
        providerUrl: getEnv('ARBITRUM_PROVIDER_URL'),
        // ~ Timestamp of block number 0 on Arbitrum
        minBlockTimestamp: UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
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
      },
    },
    updateMonitor: updateMonitorEnabled && {
      alchemyApiKey: getEnv('ETHEREUM_ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      discord: discordEnabled && {
        token: getEnv('DISCORD_TOKEN'),
        publicChannelId: getEnv('PUBLIC_DISCORD_CHANNEL_ID'),
        internalChannelId: getEnv('INTERNAL_DISCORD_CHANNEL_ID'),
      },
    },
    statusEnabled: getEnv.boolean('STATUS_ENABLED', true),
  }
}
