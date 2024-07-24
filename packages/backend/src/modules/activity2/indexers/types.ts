import { ActivityRepository } from '@l2beat/database/src/activity/repository'
import { ProjectId } from '@l2beat/shared-pure'
import { ManagedChildIndexerOptions } from '../../../tools/uif/ManagedChildIndexer'
import { TxsCountProvider } from '../services/TxsCountProvider'
import { BlockActivityIndexer } from './BlockActivityIndexer'
import { BlockTargetIndexer } from './BlockTargetIndexer'
import { DayActivityIndexer } from './DayActivityIndexer'
import { DayTargetIndexer } from './DayTargetIndexer'

export interface ActivityIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  projectId: ProjectId
  txsCountProvider: TxsCountProvider
  activityRepository: ActivityRepository
  batchSize: number
}

export interface DayActivityIndexerDeps extends ActivityIndexerDeps {
  // TODO: confirm if this logic is still needed
  // starkex APIs are not stable and can change from the past. With this we make sure to scrape them again
  uncertaintyBuffer?: number
}

export type ActivityIndexer =
  | BlockActivityIndexer
  | DayActivityIndexer
  | BlockTargetIndexer
  | DayTargetIndexer
