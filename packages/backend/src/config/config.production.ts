import { bridges, layer2s, tokenList } from '@l2beat/config'
import { LogLevel, UnixTime } from '@l2beat/shared'

import { CliParameters } from '../cli/getCliParameters'
import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'
import { getGitCommitHash } from './getGitCommitHash'

export function getProductionConfig(cli: CliParameters): Config {
  if (cli.mode !== 'server') {
    throw new Error(`No production config for mode: ${cli.mode}`)
  }

  const updateMonitorEnabled = getEnv.boolean('WATCHMODE_ENABLED', false)
  const discordEnabled =
    !!process.env.DISCORD_TOKEN &&
    !!process.env.PUBLIC_DISCORD_CHANNEL_ID &&
    !!process.env.INTERNAL_DISCORD_CHANNEL_ID

  return {
    name: 'Backend/Production',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    syncEnabled: true,
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
      tokens: tokenList,
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      coingeckoApiKey: getEnv('COINGECKO_API_KEY'),
    },
    activity: {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexCallsPerMinute: getEnv.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: false,
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
      },
    },
    updateMonitor: updateMonitorEnabled && {
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      discord: discordEnabled && {
        token: getEnv('DISCORD_TOKEN'),
        publicChannelId: getEnv('PUBLIC_DISCORD_CHANNEL_ID'),
        internalChannelId: getEnv('INTERNAL_DISCORD_CHANNEL_ID'),
      },
    },
  }
}
