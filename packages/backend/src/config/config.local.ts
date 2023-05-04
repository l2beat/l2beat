import { bridges, layer2s, tokenList } from '@l2beat/config'
import { LogLevel, UnixTime } from '@l2beat/shared'
import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'
import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(cli: CliParameters): Config {
  dotenv()
  if (cli.mode !== 'server') {
    throw new Error(`No local config for mode: ${cli.mode}`)
  }

  const tvlEnabled = getEnv.boolean('TVL_SYNC_ENABLED', true)
  const activityEnabled = getEnv.boolean('ACTIVITY_ENABLED', false)
  const updateMonitorEnabled = getEnv.boolean('WATCHMODE_ENABLED', false)
  const discordEnabled =
    !!process.env.DISCORD_TOKEN && !!process.env.INTERNAL_DISCORD_CHANNEL_ID

  return {
    name: 'Backend/Local',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    syncEnabled: !getEnv.boolean('SYNC_DISABLED', false),
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
      connection: getEnv('LOCAL_DB_URL'),
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

    tvl: tvlEnabled && {
      tokens: tokenList,
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      coingeckoApiKey: process.env.COINGECKO_API_KEY, // this is optional
    },
    activity: activityEnabled && {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexCallsPerMinute: getEnv.integer('STARKEX_CALLS_PER_MINUTE', 600),
      skipExplicitExclusion: true,
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
      },
    },
    updateMonitor: updateMonitorEnabled && {
      runOnStart: true,
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      discord: discordEnabled && {
        token: getEnv('DISCORD_TOKEN'),
        publicChannelId: process.env.PUBLIC_DISCORD_CHANNEL_ID,
        internalChannelId: getEnv('INTERNAL_DISCORD_CHANNEL_ID'),
      },
    },
  }
}
