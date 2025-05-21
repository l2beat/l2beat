import { z } from 'zod/v4'

export const TrackedTxsConfigSubtypeValues = [
  'stateUpdates',
  'batchSubmissions',
  'proofSubmissions',
] as const
export const TrackedTxsConfigSubtype = z.enum(TrackedTxsConfigSubtypeValues)
export type TrackedTxsConfigSubtype = z.infer<typeof TrackedTxsConfigSubtype>
