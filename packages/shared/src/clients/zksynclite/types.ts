import { UnixTime, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

export const ZksyncLiteBlocksResult = z.object({
  result: z.object({
    blockNumber: z.number(),
  }),
})

export const ZksyncLiteTransactionResult = z.object({
  result: z.object({
    list: z.array(
      z.object({
        txHash: z.string(),
        blockIndex: z.nullable(z.number()),
        createdAt: stringAs((s) => UnixTime.fromDate(new Date(s))),
      }),
    ),
    pagination: z.object({ count: z.number() }),
  }),
})

export const ZksyncLiteError = z.object({
  status: z.literal('error'),
  error: z.object({
    errorType: z.string(),
    code: z.number(),
    message: z.string(),
  }),
})
