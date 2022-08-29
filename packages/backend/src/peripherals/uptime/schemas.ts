import { z } from 'zod'

export const rpcSchema = z.object({
  result: z.string(),
})
