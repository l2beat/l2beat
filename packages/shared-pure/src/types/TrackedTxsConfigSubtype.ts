import { z } from 'zod'

export type TrackedTxsConfigSubtype = z.infer<typeof TrackedTxsConfigSubtype>
export const TrackedTxsConfigSubtype = z.union([
  z.literal('stateUpdates'),
  z.literal('batchSubmissions'),
  z.literal('proofSubmissions'),
])
