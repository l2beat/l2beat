import { UnixTime, numberAs } from '@l2beat/shared-pure'
import { z } from 'zod'

const MS_IN_SECOND = 1000

export const LoopringResponse = z.object({
  blockId: z.number(),
  createdAt: numberAs((n) => new UnixTime(Math.floor(n / MS_IN_SECOND))),
  transactions: z.array(z.unknown()).transform((arr) => arr.length),
})

export const LoopringError = z.object({
  resultInfo: z.object({
    code: z.number(),
    message: z.string(),
  }),
})
