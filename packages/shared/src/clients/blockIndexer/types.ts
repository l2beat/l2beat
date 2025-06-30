import { v as v } from '@l2beat/validate'

export const BlockTimestampResponse = v.union([
  v
    .object({
      blockNumber: v.unknown().transform((b) => Number(b as string)),
    })
    .transform((b) => b.blockNumber),
  v.string().transform(Number).check(Number.isInteger),
])

export type EtherscanResponse = v.infer<typeof EtherscanResponse>
export const EtherscanResponse = v.object({
  message: v.enum(['OK', 'NOTOK']),
  result: v.unknown(),
})
