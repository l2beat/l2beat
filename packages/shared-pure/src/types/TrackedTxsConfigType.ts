import { z } from 'zod/v4'

export type TrackedTxsConfigType = z.infer<typeof TrackedTxsConfigType>
export const TrackedTxsConfigType = z.union([
  z.literal('liveness'),
  z.literal('l2costs'),
])
