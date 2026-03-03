import type { Database } from '@l2beat/database'
import type { Indexer, IndexerOptions, RetryStrategy } from '@l2beat/uif'
import type { IndexerService } from '../IndexerService'
import type { IndexerTags } from '../types'

export interface Configuration<T> {
  id: string
  properties: T
  /** Inclusive */
  minHeight: number
  /** Inclusive */
  maxHeight: number | null
}

export interface SavedConfiguration<T> extends Configuration<T> {
  currentHeight: number | null
}

export interface RemovalConfiguration {
  id: string
  /** Inclusive */
  from: number
  /** Inclusive */
  to: number
}

export interface ConfigurationRange<T> {
  /** Inclusive */
  from: number
  /** Inclusive */
  to: number
  configurations: Configuration<T>[]
}

export interface ManagedMultiIndexerOptions<T> extends IndexerOptions {
  parents: Indexer[]
  name: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  serializeConfiguration?: (value: T) => string
  db: Database
  // Optionals
  tags?: IndexerTags
  updateRetryStrategy?: RetryStrategy
  /** Some indexers calculate aggregated sums
      which make configurations trimming non-trivial
      and would require re-fetching the data.
      In this case we just wipe all the data that we have
      and move the configuration state to minHeight
  */
  configurationsTrimmingDisabled?: boolean
  /** Some indexers do not include configurationId in the data table
      which makes it impossible to remove data of removed configuration
  */
  dataWipingAfterDeleteDisabled?: boolean
}
