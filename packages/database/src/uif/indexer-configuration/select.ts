import type { IndexerConfiguration } from '../../kysely/generated/types'

export const selectIndexerConfiguration = [
  'id',
  'indexerId',
  'maxHeight',
  'minHeight',
  'currentHeight',
  'properties',
] as const satisfies (keyof IndexerConfiguration)[]
