import { config as dotenv } from 'dotenv'

import { UnixTime } from '../model'
import { LogLevel } from '../tools/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getLocalConfig(): Config {
  dotenv()
  return {
    name: 'Backend/Local',
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'pretty',
    },
    port: getEnv.integer('PORT', 3000),
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseUrl: getEnv('LOCAL_DB_URL'),
    core: {
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().toStartOf('day').add(-7, 'days'),
      safeBlockRefreshIntervalMs: 30 * 1000,
      safeBlockBlockOffset: 100n,
    },
  }
}
