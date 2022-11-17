import { LogLevel } from '@l2beat/common'
import { bridges, layer2s, tokenList } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'

import { CliParameters } from '../cli/getCliParameters'
import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'
import { getGitCommitHash } from './getGitCommitHash'

export function getProductionConfig(cli: CliParameters): Config {
  if (cli.mode !== 'server') {
    throw new Error(`No production config for mode: ${cli.mode}`)
  }

  return {
    name: 'Backend/Production',
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    syncEnabled: false,
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'json',
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
    },
    api: {
      port: getEnv.integer('PORT'),
    },
    health: {
      releasedAt: getEnv('HEROKU_RELEASE_CREATED_AT', ''),
      startedAt: new Date().toISOString(),
      commitSha: getEnv('HEROKU_SLUG_COMMIT', getGitCommitHash()),
    },
    tvl: {
      tokens: tokenList,
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      coingeckoApiKey: getEnv('COINGECKO_API_KEY'),
    },
    activity: {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexApiDelayHours: 12,
      zkSyncWorkQueueWorkers: 100,
      aztecWorkQueueWorkers: 100,
      starkexWorkQueueWorkers: 10,
      starkexCallsPerMinute: 200,
      loopringWorkQueueWorkers: 10,
      loopringCallsPerMinute: 200,
      rpc: {
        workQueueLimit: 200_000,
        workQueueWorkers: getEnv.integer('ACTIVITY_RPC_WORKERS'),
        projects: {
          ethereum: {
            callsPerMinute: getEnv.integer('ACTIVITY_ETHEREUM_CALLS'),
            url: getEnv('ACTIVITY_ETHEREUM_URL'),
          },
          optimism: {
            callsPerMinute: getEnv.integer('ACTIVITY_OPTIMISM_CALLS'),
            url: getEnv('ACTIVITY_OPTIMISM_URL'),
          },
          arbitrum: {
            callsPerMinute: getEnv.integer('ACTIVITY_ARBITRUM_CALLS'),
            url: getEnv('ACTIVITY_ARBITRUM_URL'),
          },
        },
      },
    },
    activityV2: false,
    discovery: false,
  }
}
