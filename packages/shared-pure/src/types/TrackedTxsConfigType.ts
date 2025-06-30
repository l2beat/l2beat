import { v } from '@l2beat/validate'

export type TrackedTxsConfigType = v.infer<typeof TrackedTxsConfigType>
export const TrackedTxsConfigType = v.union([
  v.literal('liveness'),
  v.literal('l2costs'),
])
