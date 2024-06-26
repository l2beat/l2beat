import { SequenceProcessor as SequenceProcessorRow } from '../kysely/generated/types'

export const selectSequenceProcessor = [
  'id',
  'last_processed',
  'latest',
  'synced_once',
  'updated_at',
] as const satisfies (keyof SequenceProcessorRow)[]
