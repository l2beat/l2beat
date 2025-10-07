import { v } from '@l2beat/validate'

export type GenericErrorResponse = v.infer<typeof GenericErrorResponse>
export const GenericErrorResponse = v
  .object({
    message: v.string(),
  })
  .describe('GenericErrorResponse')
