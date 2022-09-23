import { UnixTime } from '@l2beat/types'
import { z } from 'zod'

import { stringAs } from '../../tools/types'

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
  list: z.array(z.object({ blockNumber: z.number() })),
})

export const ZksyncTransactionResultSchema = z.object({
  list: z.array(
    z.object({
      blockIndex: z.number(),
      createdAt: stringAs((s) => UnixTime.fromDate(new Date(s))),
    }),
  ),
})

export type ZksyncResponse = z.infer<typeof ZksyncResponse>
export const ZksyncResponse = z.union([
  ZksyncSuccessResponse,
  ZksyncErrorResponse,
])
