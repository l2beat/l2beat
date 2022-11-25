import { CliParameters } from '../cli/getCliParameters'
import { Config } from './Config'
import { getProductionConfig } from './config.production'
import { getEnv } from './getEnv'

export function getStagingConfig(cli: CliParameters): Config {
  if (cli.mode !== 'server') {
    throw new Error(`No staging config for mode: ${cli.mode}`)
  }

  const productionConfig = getProductionConfig(cli)

  return {
    ...productionConfig,
    name: 'Backend/Staging',
    activityV2: {
      starkexApiKey: getEnv('STARKEX_API_KEY'),
      starkexCallsPerMinute: getEnv.integer('STARKEX_CALLS_PER_MINUTE', 600),
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
