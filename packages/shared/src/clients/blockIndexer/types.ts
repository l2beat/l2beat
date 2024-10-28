import { stringAsInt } from '@l2beat/shared-pure'
import { z } from 'zod'

export const BlockTimestampResponse = z.union([
  z
    .object({
      blockNumber: z.coerce.number(),
    })
    .transform((b) => b.blockNumber),
  stringAsInt(),
])

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
export const EtherscanResponse = z.object({
  message: z.enum(['OK', 'NOTOK']),
  result: z.unknown(),
})
