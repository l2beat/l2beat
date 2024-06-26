import { IndexerConfiguration as IndexerConfigurationRow } from '../kysely/generated/types'

export const selectIndexerConfiguration = [
  'id',
  'indexer_id',
  'max_height',
  'min_height',
  'current_height',
  'properties',
] as const satisfies (keyof IndexerConfigurationRow)[]
