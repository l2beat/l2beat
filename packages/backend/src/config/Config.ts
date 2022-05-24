import { CoingeckoId, LogLevel, UnixTime } from '@l2beat/common'
import { Knex } from 'knex'

import { ProjectInfo, Token } from '../model'

export interface Config {
  name: string
  logger: {
    logLevel: LogLevel
    format: 'pretty' | 'json'
  }
  port: number
  alchemyApiKey: string
  etherscanApiKey: string
  databaseConnection: Knex.Config['connection']
  core: {
    minBlockTimestamp: UnixTime
    safeBlockRefreshIntervalMs: number
    safeBlockBlockOffset: bigint
  }
  tokens: Token[]
  coingeckoIds: CoingeckoId[]
  projects: ProjectInfo[]
}
