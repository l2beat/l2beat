import { LogLevel, UnixTime } from '@l2beat/common'
import { projects, tokenList } from '@l2beat/config'
import { config as dotenv } from 'dotenv'

import { projectToInfo } from '../model'
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
    coingeckoApiKey: process.env.COINGECKO_API_KEY, // this is optional
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseConnection: getEnv('LOCAL_DB_URL'),
    core: {
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().add(-7, 'days').toStartOf('hour'),
      safeBlockRefreshIntervalMs: 30 * 1000,
      safeTimeOffsetSeconds: 60 * 60,
    },
    tokens: tokenList.map((token) => ({
      ...token,
      priceStrategy: { type: 'market' },
    })),
    projects: projects.map(projectToInfo),
    syncEnabled: !getEnv.boolean('SYNC_DISABLED', false),
  }
}
