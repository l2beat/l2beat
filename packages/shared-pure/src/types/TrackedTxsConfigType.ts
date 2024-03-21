import { z } from 'zod'

export type TrackedTxsConfigType = z.infer<typeof TrackedTxsConfigType>
export const TrackedTxsConfigType = z.literal('liveness')
