import { LogLevel } from '@l2beat/common'
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

  eventsSync: boolean
  tvlReportSync: boolean
  transactionCountSync:
    | {
        starkexApiUrl: string
        starkexApiKey: string
        arbitrumAlchemyApiKey: string
        optimismAlchemyApiKey: string
        ethereumAlchemyApiKey: string
        rpcWorkQueueLimit: number
        rpcWorkQueueWorkers: number
        zkSyncWorkQueueWorkers: number
        starkexWorkQueueWorkers: number
        loopringWorkQueueWorkers: number
        loopringCallsPerMinute: number
      }
    | false
}

export type TransactionCountSyncConfig = Exclude<
  Config['transactionCountSync'],
  false
>
