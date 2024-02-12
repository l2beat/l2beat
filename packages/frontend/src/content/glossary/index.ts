import { z } from 'zod'

export const glossaryContent = {
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    isSpicy: z.boolean(),
  }),
} as const
