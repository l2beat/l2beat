import { IndexerState } from '../../kysely/generated/types'

export const selectIndexerState = [
  'configHash',
  'indexerId',
  'minTimestamp',
  'safeHeight',
] as const satisfies (keyof IndexerState)[]
