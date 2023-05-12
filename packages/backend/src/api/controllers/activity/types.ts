import { ProjectId, UnixTime } from '@l2beat/common'

export interface DailyTransactionCount {
  count: number
  timestamp: UnixTime
}

export type DailyTransactionCountProjectsMap = Map<
  ProjectId,
  DailyTransactionCount[]
>
