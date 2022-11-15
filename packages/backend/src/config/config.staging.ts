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
    activityV2: {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexApiDelayHours: 12,
      starkexCallsPerMinute: 200,
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
  }
}
