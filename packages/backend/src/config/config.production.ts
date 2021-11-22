import { UnixTime } from '../model'
import { LogLevel } from '../tools/Logger'
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
    databaseUrl: getEnv('DATABASE_URL'),
    core: {
      // TODO: This should probably be the day after Multicall was deployed
      minBlockTimestamp: UnixTime.fromDate(new Date('2021-09-07T00:00:00Z')),
      safeBlockRefreshIntervalMs: 5 * 60 * 1000,
      safeBlockBlockOffset: 100n,
    },
    // TODO: import from @l2beat/config
    tokens: [],
  }
}
