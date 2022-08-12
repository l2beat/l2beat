import { LogLevel, UnixTime } from '@l2beat/common'
import { projects, tokenList } from '@l2beat/config'

import { projectToInfo } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getProductionConfig(): Config {
  const name = 'Backend/Production'
  return {
    name,
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'json',
    },
    port: getEnv.integer('PORT'),
    coingeckoApiKey: getEnv('COINGECKO_API_KEY'),
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseConnection: {
      connectionString: getEnv('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
      application_name: name,
    },
    core: {
      minBlockTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
      safeBlockRefreshIntervalMs: 5 * 60 * 1000,
      safeTimeOffsetSeconds: 60 * 60,
    },
    tokens: tokenList.map((token) => ({
      ...token,
      priceStrategy: { type: 'market' },
    })),
    projects: projects.map(projectToInfo),
    syncEnabled: !getEnv.boolean('SYNC_DISABLED', false),
    freshStart: false,
  }
}
