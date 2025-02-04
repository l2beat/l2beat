import type { BlockTargetIndexer } from './BlockTargetIndexer'
import type { EthereumDaIndexer } from './EthereumDaIndexer'

// Re-used from activity module for now
export type DataAvailabilityIndexer = BlockTargetIndexer | EthereumDaIndexer
