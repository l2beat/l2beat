import { z } from 'zod/v4'

export const StarkexApiSuccessResponse = z.object({
  count: z.number(),
})

export const StarkexApiErrorResponse = z.object({
  message: z.string(),
})
