import { CliParameters } from '../cli/getCliParameters'
import { Config } from './Config'
import { getProductionConfig } from './config.production'

export function getStagingConfig(cli: CliParameters): Config {
  if (cli.mode !== 'server') {
    throw new Error(`No staging config for mode: ${cli.mode}`)
  }

  const productionConfig = getProductionConfig(cli)

  return {
    ...productionConfig,
    activity: productionConfig.activity && {
      ...productionConfig.activity,
      skipExplicitExclusion: true,
    },
    name: 'Backend/Staging',
  }
}
