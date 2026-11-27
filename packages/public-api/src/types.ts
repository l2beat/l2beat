import { v } from '@l2beat/validate'

// Every error body has a `message`. Some add a field that says more.

export type GenericErrorResponse = v.infer<typeof GenericErrorResponse>
export const GenericErrorResponse = v
  .object({
    message: v.string(),
  })
  .describe('GenericErrorResponse')

export type BadRequestResponse = v.infer<typeof BadRequestResponse>
export const BadRequestResponse = v
  .object({
    path: v.string().meta({
      description:
        'The parameter that was refused, e.g. `.query.range` or `.params.projectId`.',
    }),
    message: v.string(),
  })
  .describe('BadRequestResponse')

export type InternalErrorResponse = v.infer<typeof InternalErrorResponse>
export const InternalErrorResponse = v
  .object({
    message: v.string(),
    errorId: v.string().meta({
      description: 'Identifies the failure in our logs.',
    }),
  })
  .describe('InternalErrorResponse')
