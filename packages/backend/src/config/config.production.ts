import { LogLevel } from '../tools/Logger'
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
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseUrl: getEnv('DATABASE_URL'),
  }
}
