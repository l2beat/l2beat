import type { ActivityRecord, Database } from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ManagedChildIndexerOptions } from '../../../tools/uif/ManagedChildIndexer'
import type { BlockActivityIndexer } from './BlockActivityIndexer'
import type { BlockTargetIndexer } from './BlockTargetIndexer'
import type { DayActivityIndexer } from './DayActivityIndexer'
import type { DayTargetIndexer } from './DayTargetIndexer'
import type { SlotTargetIndexer } from './SlotTargetIndexer'

export interface ActivityIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  projectId: ProjectId
  txsCountService: TxsCountService
  db: Database
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
}

export interface TxsCountService {
  getTxsCount(from: number, to: number): Promise<ActivityRecord[]>
}

export interface DayActivityIndexerDeps extends ActivityIndexerDeps {
  // TODO: confirm if this logic is still needed
  // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
  uncertaintyBuffer: number
}

export type ActivityIndexer =
  | BlockActivityIndexer
  | DayActivityIndexer
  | BlockTargetIndexer
  | DayTargetIndexer
  | SlotTargetIndexer
