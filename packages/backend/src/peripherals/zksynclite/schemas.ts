import { UnixTime, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

export type ZksyncLiteSuccessResponse = z.infer<
  typeof ZksyncLiteSuccessResponse
>
const ZksyncLiteSuccessResponse = z.object({
  status: z.literal('success'),
  error: z.null(),
  result: z.unknown(),
})

export type ZksyncLiteErrorResponse = z.infer<typeof ZksyncLiteErrorResponse>
const ZksyncLiteErrorResponse = z.object({
  status: z.literal('error'),
  error: z.object({
    errorType: z.string(),
    code: z.number(),
    message: z.string(),
  }),
  result: z.null(),
})

export const ZksyncLiteBlocksResultSchema = z.object({
  blockNumber: z.number(),
})

export const ZksyncLiteTransactionResultSchema = z.object({
  list: z.array(
    z.object({
      txHash: z.string(),
      blockIndex: z.nullable(z.number()),
      createdAt: stringAs((s) => UnixTime.fromDate(new Date(s))),
    }),
  ),
  pagination: z.object({ count: z.number() }),
})

export type ZksyncLiteResponse = z.infer<typeof ZksyncLiteResponse>
export const ZksyncLiteResponse = z.union([
  ZksyncLiteSuccessResponse,
  ZksyncLiteErrorResponse,
])
