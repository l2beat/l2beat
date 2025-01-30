import type { BlockTargetIndexer } from '../../activity/indexers/BlockTargetIndexer'
import type { EthereumDaIndexer } from './EthereumDaIndexer'

// Re-used from activity module for now
export type DataAvailabilityIndexer = BlockTargetIndexer | EthereumDaIndexer
