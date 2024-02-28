import { numberAs, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

const MS_IN_SECOND = 1000

export const DegateCode = z.number()
export const DegateData = z.object({
  blockId: z.number(),
  createdAt: numberAs((n) => new UnixTime(Math.floor(n / MS_IN_SECOND))),
  transactions: z.array(z.unknown()).transform((arr) => arr.length),
})

export const DegateResponse = z.object({
  code: DegateCode,
  data: DegateData,
})