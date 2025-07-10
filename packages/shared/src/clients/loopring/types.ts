import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

const MS_IN_SECOND = 1000

// Data
export const LoopringBlock = v.object({
  blockId: v.number(),
  createdAt: v
    .number()
    .transform((n) => UnixTime(Math.floor(n / MS_IN_SECOND))),
  transactions: v.array(
    v.object({
      txType: v.string(),
    }),
  ),
})

export const DegateBlock = v.object({
  data: LoopringBlock,
})

// Errors
export const DegateError = v.object({
  code: v.number().check((v) => v > 0),
  message: v.string(),
})

export const LoopringError = v.object({
  resultInfo: DegateError,
})
