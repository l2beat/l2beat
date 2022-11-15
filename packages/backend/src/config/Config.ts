import { LogLevel } from '@l2beat/common'
import { Layer2TransactionApiV2 } from '@l2beat/config'
import { UnixTime } from '@l2beat/types'
import { Knex } from 'knex'

import { Project, Token } from '../model'

export interface Config {
  name: string
  logger: {
    logLevel: LogLevel
    format: 'pretty' | 'json'
  }
  port: number
  coingeckoApiKey: string | undefined
  alchemyApiKey: string
  etherscanApiKey: string
  databaseConnection: Knex.Config['connection']
  core: {
    minBlockTimestamp: UnixTime
    safeBlockRefreshIntervalMs: number
    safeTimeOffsetSeconds: number
  }
  tokens: Token[]
  projects: Project[]
  syncEnabled: boolean
  freshStart: boolean
  tvlReportSync: boolean
  transactionCountSync:
    | {
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
            { callsPerMinute?: number; url: string } | undefined
          >
        }
      }
    | false
  activityV2:
    | {
        starkexApiKey: string
        starkexApiDelayHours: number
        starkexCallsPerMinute: number
        allowedProjectIds?: string[]
        projects: Record<string, Layer2TransactionApiV2 | undefined>
      }
    | false
  health?: HealthStatus
  discoveryBlockNumber?: number
}

export interface HealthStatus {
  releasedAt?: string
  startedAt: string
  commitSha: string
}

export type TransactionCountSyncConfig = Exclude<
  Config['transactionCountSync'],
  false
>

export type ActivityV2Config = Exclude<Config['activityV2'], false>
