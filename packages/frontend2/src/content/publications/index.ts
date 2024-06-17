import { z } from 'zod'

import { defineCollection } from '../define-collections'

export const publicationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    description: z.string().optional(),
    publishedOn: z.coerce.date(),
    authorId: z.string(),
  }),
})
