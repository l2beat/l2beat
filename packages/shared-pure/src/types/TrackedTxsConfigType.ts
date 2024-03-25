import { z } from 'zod'

export type TrackedTxsConfigType = z.infer<typeof TrackedTxsConfigType>
export const TrackedTxsConfigType = z.union([
  z.literal('liveness'),
  z.literal('l2costs'),
])
