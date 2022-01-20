import { LogLevel, UnixTime } from '@l2beat/common'

import { Token } from '../model'

export interface Config {
  name: string
  logger: {
    logLevel: LogLevel
    format: 'pretty' | 'json'
  }
  port: number
  alchemyApiKey: string
  etherscanApiKey: string
  databaseUrl: string
  core: {
    minBlockTimestamp: UnixTime
    safeBlockRefreshIntervalMs: number
    safeBlockBlockOffset: bigint
  }
  tokens: Token[]
}
