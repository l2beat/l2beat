import { z } from 'zod'

export const publicationsContent = {
  schema: z.object({
    title: z.string(),
    link: z.string(),
    publishedOn: z.coerce.date(),
  }),
} as const
