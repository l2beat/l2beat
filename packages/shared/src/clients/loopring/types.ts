import { UnixTime, numberAs } from '@l2beat/shared-pure'
import { z } from 'zod'

const MS_IN_SECOND = 1000

// Data
export const LoopringBlock = z.object({
  blockId: z.number(),
  createdAt: numberAs((n) => new UnixTime(Math.floor(n / MS_IN_SECOND))),
  transactions: z.array(
    z.object({
      txType: z.string(),
    }),
  ),
})

export const DegateBlock = z.object({
  data: LoopringBlock,
})

// Errors
export const DegateError = z.object({
  code: z.number().gt(0),
  message: z.string(),
})

export const LoopringError = z.object({
  resultInfo: DegateError,
})
