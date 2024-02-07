import { z } from 'zod'

import { defineCollection } from '../defineCollection'

export const publicationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedOn: z.coerce.date(),
  }),
})
