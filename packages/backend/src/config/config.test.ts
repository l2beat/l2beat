import { config as dotenv } from 'dotenv'

import { LogLevel } from '../services/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getTestConfig(): Config {
  dotenv()
  return {
    name: 'Backend/Test',
    logger: {
      logLevel: LogLevel.NONE,
      format: 'plain',
    },
    port: 1337,
    alchemyApiKey: 'xXTestAlchemyKeyXx',
    etherscanApiKey: 'xXTestEtherscanKeyXx',
    databaseUrl: getEnv('TEST_DB_URL', 'xXTestDatabaseUrlXx'),
  }
}
