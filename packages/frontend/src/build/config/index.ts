import { Config } from './Config'
import { getCIConfig } from './config.ci'
import { getLocalConfig } from './config.local'
import { getProductionConfig } from './config.production'
import { getStagingConfig } from './config.staging'

export type { Config }

export function getConfig(env: string): Config {
  switch (env) {
    case 'ci':
      return getCIConfig()
    case 'local':
      return getLocalConfig()
    case 'staging':
      return getStagingConfig()
    case 'production':
      return getProductionConfig()
  }
  throw new TypeError(`Unrecognized env: ${env}!`)
}
