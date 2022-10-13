import { Knex } from 'knex'

import { Config } from './Config'
import { getProductionConfig } from './config.production'
import { getEnv } from './getEnv'

export function getStagingConfig(): Config {
  const name = 'Backend/Staging'
  const productionConfig = getProductionConfig()

  return {
    ...productionConfig,

    name,
    databaseConnection: {
      ...(productionConfig.databaseConnection as Knex.PgConnectionConfig),
      application_name: name,
    },
    tvlReportSync: true,
    transactionCountSync: {
      starkexApiUrl: getEnv('STARKEX_API_URL'),
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      zkSyncWorkQueueWorkers: 100,
      starkexWorkQueueWorkers: 1,
      starkexCallsPerMinute: 400,
      loopringWorkQueueWorkers: 1,
      loopringCallsPerMinute: 400,
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
