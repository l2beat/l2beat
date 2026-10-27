import type {
  ActivityPeaks,
  ActivityRecord,
  Database,
  HourlyActivityRecord,
} from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ManagedChildIndexerOptions } from '../../../tools/uif/ManagedChildIndexer'
import type { ActivityBlock } from '../services/txs/types'
import type { BlockActivityIndexer } from './BlockActivityIndexer'
import type { BlockTargetIndexer } from './BlockTargetIndexer'
import type { DayActivityIndexer } from './DayActivityIndexer'
import type { DayTargetIndexer } from './DayTargetIndexer'
import type { SlotTargetIndexer } from './SlotTargetIndexer'

export interface ActivityIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  projectId: ProjectId
  db: Database
  /** The number of blocks/days to process at once. In case of error this is the maximum amount of blocks/days we will need to refetch */
  batchSize: number
}

export interface BlockActivityIndexerDeps extends ActivityIndexerDeps {
  blockSource: ActivityBlockSource
}

export interface ActivityBlockSource {
  /** With their tx and uops counts, in ascending block order */
  getBlocks(from: number, to: number): Promise<ActivityBlock[]>
}

/** Sources with hours also give the day's busiest hour */
export type DayActivityRecord = ActivityRecord &
  Partial<Pick<ActivityPeaks, 'peakHourCount' | 'peakHourUopsCount'>>

export interface TxsCountService {
  getTxsCount(
    from: number,
    to: number,
  ): Promise<{
    records: DayActivityRecord[]
    /** Only from sources with hours */
    hours?: HourlyActivityRecord[]
    latestTimestamp: number
  }>
}

export interface DayActivityIndexerDeps extends ActivityIndexerDeps {
  txsCountService: TxsCountService
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
