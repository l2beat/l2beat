import { IndexerState as IndexerStateRow } from '../kysely/generated/types'

export const selectIndexerState = [
  'config_hash',
  'indexer_id',
  'min_timestamp',
  'safe_height',
] as const satisfies (keyof IndexerStateRow)[]
