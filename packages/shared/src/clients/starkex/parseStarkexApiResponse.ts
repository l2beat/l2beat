import { z } from 'zod'

export type StarkexApiSuccessResponse = z.infer<
  typeof StarkexApiSuccessResponse
>
export const StarkexApiSuccessResponse = z.object({
  count: z.number(),
})

export const StarkexApiErrorResponse = z.object({
  message: z.string(),
})
