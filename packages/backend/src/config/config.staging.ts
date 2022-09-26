import { Knex } from 'knex'

import { Config } from './Config'
import { getProductionConfig } from './config.production'

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
    eventsSyncEnabled: true,
  }
}
