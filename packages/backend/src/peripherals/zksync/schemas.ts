import { stringAs, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

export type ZksyncSuccessResponse = z.infer<typeof ZksyncSuccessResponse>
const ZksyncSuccessResponse = z.object({
  status: z.literal('success'),
  error: z.null(),
  result: z.unknown(),
})

export type ZksyncErrorResponse = z.infer<typeof ZksyncErrorResponse>
const ZksyncErrorResponse = z.object({
  status: z.literal('error'),
  error: z.object({
    errorType: z.string(),
    code: z.number(),
    message: z.string(),
  }),
  result: z.null(),
})

export const ZksyncBlocksResultSchema = z.object({
  blockNumber: z.number(),
})

export const ZksyncTransactionResultSchema = z.object({
  list: z.array(
    z.object({
      txHash: z.string(),
      blockIndex: z.nullable(z.number()),
      createdAt: stringAs((s) => UnixTime.fromDate(new Date(s))),
    }),
  ),
  pagination: z.object({ count: z.number() }),
})

export type ZksyncResponse = z.infer<typeof ZksyncResponse>
export const ZksyncResponse = z.union([
  ZksyncSuccessResponse,
  ZksyncErrorResponse,
])
