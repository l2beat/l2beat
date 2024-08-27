import { SequenceProcessor } from '../../kysely/generated/types'

export const selectSequenceProcessor = [
  'id',
  'lastProcessed',
  'latest',
  'syncedOnce',
  'updatedAt',
] as const satisfies (keyof SequenceProcessor)[]
