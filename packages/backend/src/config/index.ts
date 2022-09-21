import { Config } from './Config'
import { getLocalConfig } from './config.local'
import { getProductionConfig } from './config.production'
import { getStagingConfig } from './config.staging'
import { getTestConfig } from './config.test'

export type { Config }

export function getConfig(env: string): Config {
  switch (env) {
    case 'local':
      return getLocalConfig()
    case 'staging':
      return getStagingConfig()
    case 'production':
      return getProductionConfig()
    case 'test':
      return getTestConfig()
  }
  throw new TypeError(`Unrecognized env: ${env}!`)
}
