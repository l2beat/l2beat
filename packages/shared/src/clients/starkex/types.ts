import { z } from 'zod'

export const StarkexApiSuccessResponse = z.object({
  count: z.number(),
})

export const StarkexApiErrorResponse = z.object({
  message: z.string(),
})
