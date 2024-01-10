import { Env } from '@l2beat/backend-tools'

import { Config } from './Config'
import { getProductionConfig } from './config.production'

export function getStagingConfig(env: Env): Config {
  const productionConfig = getProductionConfig(env)
  const errorReportingEnabled = !!env.optionalString('BUGSNAG_API_KEY')

  return {
    ...productionConfig,
    activity: productionConfig.activity && {
      ...productionConfig.activity,
    },
    name: 'Backend/Staging',
    errorReporting: errorReportingEnabled && {
      bugsnagApiKey: env.string('BUGSNAG_API_KEY'),
      environment: 'staging',
    },
  }
}
