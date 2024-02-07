import { z } from 'zod'

export const delegatedProjectsContent = {
  schema: z.object({
    name: z.string(),
    delegateTokensUrl: z.string().url(),
  }),
} as const
