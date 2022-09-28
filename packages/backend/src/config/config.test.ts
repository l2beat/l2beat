import { LogLevel } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { config as dotenv } from 'dotenv'

import { Config } from './Config'
import { getEnv } from './getEnv'

export function getTestConfig(): Config {
  dotenv()
  return {
    name: 'Backend/Test',
    logger: {
      logLevel: LogLevel.NONE,
      format: 'json',
    },
    port: 1337,
    coingeckoApiKey: undefined,
    alchemyApiKey: 'xXTestAlchemyKeyXx',
    etherscanApiKey: 'xXTestEtherscanKeyXx',
    starkexApiUrl: 'xXTestStarkexApiUrlXx',
    starkexApiKey: 'xXTestStarkexApiKeyXx',
    databaseConnection: getEnv('TEST_DB_URL', 'xXTestDatabaseUrlXx'),
    core: {
      minBlockTimestamp: new UnixTime(0),
      safeBlockRefreshIntervalMs: 0,
      safeTimeOffsetSeconds: 0,
    },
    tokens: [],
    projects: [],
    syncEnabled: !getEnv.boolean('SYNC_DISABLED', false),
    freshStart: false,
    eventsSyncEnabled: false,
    transactionCountSyncEnabled: false,
    arbitrumAlchemyApiKey: 'xXTestAlchemyKeyXx',
    optimismAlchemyApiKey: 'xXTestAlchemyKeyXx',
  }
}
