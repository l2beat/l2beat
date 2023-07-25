import { Config } from './Config'
import { getProductionConfig } from './config.production'

export function getStagingConfig(): Config {
  const productionConfig = getProductionConfig()

  return {
    ...productionConfig,
    activity: productionConfig.activity && {
      ...productionConfig.activity,
    },
    name: 'Backend/Staging',
  }
}
