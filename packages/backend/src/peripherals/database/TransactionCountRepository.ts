import { ProjectId, UnixTime } from '@l2beat/types'

export interface TransactionCountRepository {
  getDailyTransactionCount(
    projectId: ProjectId,
  ): Promise<{ timestamp: UnixTime; count: number }[]>
}
