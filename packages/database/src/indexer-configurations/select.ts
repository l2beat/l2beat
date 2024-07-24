import { IndexerConfiguration } from '../kysely/generated/types'

export const selectIndexerConfigurations = [
  'id',
  'indexer_id',
  'max_height',
  'min_height',
  'current_height',
  'properties',
] as const satisfies (keyof IndexerConfiguration)[]
