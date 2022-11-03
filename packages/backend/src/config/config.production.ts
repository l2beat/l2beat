import { LogLevel } from '@l2beat/common'
import { bridges, layer2s, tokenList } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'

import { bridgeToProject, layer2ToProject } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getProductionConfig(): Config {
  const name = 'Backend/Production'
  return {
    name,
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'json',
    },
    port: getEnv.integer('PORT'),
    coingeckoApiKey: getEnv('COINGECKO_API_KEY'),
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseConnection: {
      connectionString: getEnv('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
      application_name: name,
    },
    core: {
      minBlockTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
      safeBlockRefreshIntervalMs: 5 * 60 * 1000,
      safeTimeOffsetSeconds: 60 * 60,
    },
    tokens: tokenList.map((token) => ({
      ...token,
      priceStrategy: { type: 'market' },
    })),
    projects: layer2s.map(layer2ToProject).concat(bridges.map(bridgeToProject)),
    syncEnabled: !getEnv.boolean('SYNC_DISABLED', false),
    freshStart: false,
    tvlReportSync: true,
    transactionCountSync: {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexApiDelayHours: 5,
      zkSyncWorkQueueWorkers: 100,
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
  }
}
