import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { Indexer, IndexerOptions, RetryStrategy } from '@l2beat/uif'
import { IndexerService } from '../IndexerService'

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
  tag?: string
  indexerService: IndexerService
  configurations: Configuration<T>[]
  serializeConfiguration: (value: T) => string
  logger: Logger
  updateRetryStrategy?: RetryStrategy
  /** Used for saving data in transaction */
  db: Database
}
