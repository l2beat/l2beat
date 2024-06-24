import { z } from 'zod'

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
export const EtherscanResponse = z.object({
  message: z.enum(['OK', 'NOTOK']),
  result: z.unknown(),
})
