import { ProjectId, UnixTime } from '@l2beat/types'

export interface DailyTransactionCount {
  count: number
  timestamp: UnixTime
}

export type DailyTransactionCountMap = Map<ProjectId, DailyTransactionCount[]>
