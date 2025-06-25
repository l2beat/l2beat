import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const ZksyncLiteBlocksResult = v.object({
  result: v.object({
    blockNumber: v.number(),
  }),
})

export const ZksyncLiteTransactionResult = v.object({
  result: v.object({
    list: v.array(
      v.object({
        txHash: v.string(),
        blockIndex: v.union([v.number(), v.null()]),
        createdAt: v.string().transform((s) => UnixTime.fromDate(new Date(s))),
      }),
    ),
    pagination: v.object({ count: v.number() }),
  }),
})

export const ZksyncLiteError = v.object({
  status: v.literal('error'),
  error: v.object({
    errorType: v.string(),
    code: v.number(),
    message: v.string(),
  }),
})
