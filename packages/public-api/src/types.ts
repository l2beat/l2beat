import { v } from '@l2beat/validate'

export type GenericErrorResponse = v.infer<typeof GenericErrorResponse>
export const GenericErrorResponse = v
  .object({
    error: v.string(),
  })
  .describe('GenericErrorResponse')
