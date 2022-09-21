import { Config } from './Config'
import { getProductionConfig } from './config.production'

export function getStagingConfig(): Config {
  const name = 'Backend/Staging'
  const prodConfig = getProductionConfig()
  return {
    ...prodConfig,

    name,
    databaseConnection: {
      ...prodConfig,
      application_name: name,
    },
    eventsSyncEnabled: true,
  }
}
