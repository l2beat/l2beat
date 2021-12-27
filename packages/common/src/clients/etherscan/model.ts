import { z } from 'zod'

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
export const EtherscanResponse = z.object({
  status: z.enum(['1', '0']),
  message: z.string(),
  result: z.any(),
})
