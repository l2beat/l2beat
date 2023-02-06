import { ProjectId, UnixTime } from '@l2beat/shared'

export interface DailyTransactionCount {
  count: number
  timestamp: UnixTime
}

export type DailyTransactionCountProjectsMap = Map<
  ProjectId,
  DailyTransactionCount[]
>
