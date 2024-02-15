import { z } from 'zod'

import { defineCollection } from '../defineCollection'

export const publicationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    description: z.string(),
    publishedOn: z.coerce.date(),
    authorId: z.string(),
    readTimeInMinutes: z.number(),
  }),
})
