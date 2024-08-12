import { ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface DailyTransactionCount {
  count: number
  timestamp: UnixTime
}

export type DailyTransactionCountProjectsMap = Map<
  ProjectId,
  DailyTransactionCount[]
>
