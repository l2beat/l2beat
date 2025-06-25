import { v as z } from '@l2beat/validate'

export const TrackedTxsConfigSubtypeValues = [
  'stateUpdates',
  'batchSubmissions',
  'proofSubmissions',
] as const
export const TrackedTxsConfigSubtype = z.enum(TrackedTxsConfigSubtypeValues)
export type TrackedTxsConfigSubtype = z.infer<typeof TrackedTxsConfigSubtype>
