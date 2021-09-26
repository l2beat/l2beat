import { LogLevel } from '../services/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getProductionConfig(): Config {
  return {
    name: 'Backend/Production',
    logger: {
      logLevel: LogLevel.INFO,
      format: 'plain',
    },
    port: getEnv.integer('PORT'),
    ethereumJsonRpcUrl: getEnv('RPC_URL'),
  }
}
