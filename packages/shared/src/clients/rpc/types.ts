import { stringAsInt } from '@l2beat/shared-pure'
import { z } from 'zod'

export const RpcResponse = z.object({
  result: z.union([z.string(), z.number(), z.record(z.string(), z.any())]),
})

export type Block = z.infer<typeof Block>
export const Block = z.object({
  // TODO: add support for including txs body
  transactions: z.array(z.string()),
  timestamp: stringAsInt(),
  hash: z.string(),
  number: stringAsInt(),
})
