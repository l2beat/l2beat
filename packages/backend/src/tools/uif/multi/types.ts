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

export type RemovalConfiguration =
  | TrimRemovalConfiguration
  | WipeRemovalConfiguration

export type TrimRemovalConfiguration = {
  type: 'trim'
  id: string
  /** Inclusive range */
  range: [number, number]
}

export type WipeRemovalConfiguration = {
  type: 'wipe'
  id: string
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
}
