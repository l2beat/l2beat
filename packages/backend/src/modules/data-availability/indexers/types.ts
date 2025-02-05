import type { BlockTargetIndexer } from './BlockTargetIndexer'
import type { DaIndexer } from './DaIndexer'

// Re-used from activity module for now
export type DataAvailabilityIndexer = BlockTargetIndexer | DaIndexer
