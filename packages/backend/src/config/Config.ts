import { LogLevel, Token, UnixTime } from '@l2beat/common'

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
