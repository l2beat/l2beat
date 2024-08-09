import { ActivityRecord, Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { ManagedChildIndexerOptions } from '../../../tools/uif/ManagedChildIndexer'
import { BlockActivityIndexer } from './BlockActivityIndexer'
import { BlockTargetIndexer } from './BlockTargetIndexer'
import { DayActivityIndexer } from './DayActivityIndexer'
import { DayTargetIndexer } from './DayTargetIndexer'

export interface ActivityIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  projectId: ProjectId
  txsCountProvider: TxsCountProvider
  db: Database
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
}

export interface TxsCountProvider {
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
