import { stringAsInt } from '@l2beat/shared-pure'
import { z } from 'zod'

export const RpcResponse = z.object({
  result: z.unknown(),
})

export type Block = z.infer<typeof Block>
export const Block = z.object({
  transactions: z.array(z.string()),
  timestamp: stringAsInt(),
  hash: z.string(),
  number: stringAsInt(),
})
