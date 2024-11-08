import { UnixTime, numberAs } from '@l2beat/shared-pure'
import { z } from 'zod'

const MS_IN_SECOND = 1000

export const DegateBlock = z.object({
  data: z.object({
    blockId: z.number(),
    createdAt: numberAs((n) => new UnixTime(Math.floor(n / MS_IN_SECOND))),
    transactions: z.array(
      z.object({
        txType: z.string(),
      }),
    ),
  }),
})

export const DegateError = z.object({
  code: z.number().gt(0),
  message: z.string(),
})
