import { LogLevel } from '@l2beat/common'
import { Layer2TransactionApiV2 } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'
import { Knex } from 'knex'

import { Project, Token } from '../model'

export interface Config {
  name: string
  projects: Project[]
  syncEnabled: boolean
  logger: LoggerConfig
  clock: ClockConfig
  database: DatabaseConfig | false
  api: ApiConfig | false
  health: HealthConfig
  tvl: TvlConfig | false
  activity: ActivityConfig | false
  activityV2: ActivityV2Config | false
  discovery: DiscoveryConfig | false
}

export interface LoggerConfig {
  logLevel: LogLevel
  format: 'pretty' | 'json'
}

export interface ApiConfig {
  port: number
}

export interface DatabaseConfig {
  connection: Knex.Config['connection']
  freshStart: boolean
}

export interface ClockConfig {
  minBlockTimestamp: UnixTime
  safeTimeOffsetSeconds: number
}

export interface TvlConfig {
  tokens: Token[]
  alchemyApiKey: string
  etherscanApiKey: string
  coingeckoApiKey: string | undefined
}

export interface HealthConfig {
  releasedAt?: string
  startedAt: string
  commitSha: string
}

export interface ActivityConfig {
  starkexApiKey: string
  starkexApiDelayHours: number
  zkSyncWorkQueueWorkers: number
  aztecWorkQueueWorkers: number
  starkexWorkQueueWorkers: number
  loopringWorkQueueWorkers: number
  loopringCallsPerMinute: number
  starkexCallsPerMinute: number
  rpc: {
    workQueueLimit: number
    workQueueWorkers: number
    projects: Record<
      string,
      | {
          callsPerMinute?: number
          url: string
        }
      | undefined
    >
  }
}

export interface ActivityV2Config {
  starkexApiKey: string
  starkexApiDelayHours: number
  starkexCallsPerMinute: number
  allowedProjectIds?: string[]
  projects: Record<string, Layer2TransactionApiV2 | undefined>
}

export interface DiscoveryConfig {
  blockNumber?: number
  alchemyApiKey: string
  etherscanApiKey: string
}
