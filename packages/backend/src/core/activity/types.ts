import { ProjectId, UnixTime } from '@l2beat/types'

import { SequenceProcessor } from '../SequenceProcessor'
export interface DailyTransactionCount {
  count: number
  timestamp: UnixTime
}
export interface TransactionCounter {
  processor: SequenceProcessor
  getLastProcessedTimestamp: () => Promise<UnixTime | undefined>
}

export type DailyTransactionCountProjectsMap = Map<
  ProjectId,
  DailyTransactionCount[]
>
