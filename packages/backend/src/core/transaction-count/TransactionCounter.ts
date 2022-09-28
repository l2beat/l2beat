import { ProjectId, UnixTime } from '@l2beat/types'

export interface ProjectCounts {
  projectId: ProjectId
  counts: { timestamp: UnixTime; count: number }[]
}

export interface TransactionCounter {
  getDailyTransactionCounts(): Promise<ProjectCounts>
}
