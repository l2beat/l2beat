import { UnixTime, numberAs } from '@l2beat/shared-pure'
import { z } from 'zod'

const MS_IN_SECOND = 1000

const DegateCode = z.number()
const DegateData = z.object({
  blockId: z.number(),
  createdAt: numberAs((n) => new UnixTime(Math.floor(n / MS_IN_SECOND))),
  transactions: z.array(
    z.object({
      txType: z.string(),
    }),
  ),
})

export const DegateResponse = z.object({
  code: DegateCode,
  data: DegateData,
})

export const DegateError = z.object({
  code: z.number().gt(0),
  message: z.string(),
})
