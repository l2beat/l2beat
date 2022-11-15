import { CliParameters } from '../cli/getCliParameters'
import { Config } from './Config'
import { getLocalConfig } from './config.local'
import { getProductionConfig } from './config.production'
import { getStagingConfig } from './config.staging'

export type { Config }

export function getConfig(env: string, cli: CliParameters): Config {
  switch (env) {
    case 'local':
      return getLocalConfig(cli)
    case 'staging':
      return getStagingConfig(cli)
    case 'production':
      return getProductionConfig(cli)
  }
  throw new TypeError(`Unrecognized env: ${env}!`)
}
