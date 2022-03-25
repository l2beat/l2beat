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
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseUrl: getEnv('LOCAL_DB_URL'),
    core: {
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().add(-2, 'hours').toStartOf('hour'),
      safeBlockRefreshIntervalMs: 30 * 1000,
      safeBlockBlockOffset: 100n,
    },
    tokens: tokenList.map((token) => ({
      ...token,
      priceStrategy: { type: 'market' },
    })),
    coingeckoIds: tokenList.map((t) => t.coingeckoId),
    projects: projects.map(projectToInfo),
  }
}
