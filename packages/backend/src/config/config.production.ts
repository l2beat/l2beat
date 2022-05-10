import { LogLevel, UnixTime } from '@l2beat/common'
import { projects, tokenList } from '@l2beat/config'

import { projectToInfo } from '../model'
import { Config } from './Config'
import { getEnv } from './getEnv'

export function getProductionConfig(): Config {
  return {
    name: 'Backend/Production',
    logger: {
      logLevel: LogLevel.INFO,
      format: 'json',
    },
    port: getEnv.integer('PORT'),
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseConnection: {
      connectionString: getEnv('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
    },
    core: {
      // TODO: set minimum timestamp from when to fetch prices
      //right now it is the earliest fetched date from previous backend
      minBlockTimestamp: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
      safeBlockRefreshIntervalMs: 5 * 60 * 1000,
      safeBlockBlockOffset: 100n,
    },
    // TODO: import from @l2beat/config
    tokens: tokenList.map((token) => ({
      ...token,
      priceStrategy: { type: 'market' },
    })),
    coingeckoIds: tokenList.map((t) => t.coingeckoId),
    projects: projects.map(projectToInfo),
  }
}
