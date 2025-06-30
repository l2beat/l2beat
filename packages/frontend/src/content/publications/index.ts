import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

export const publicationsCollection = defineCollection({
  type: 'content',
  schema: v.object({
    title: v.string(),
    shortTitle: v.string().optional(),
    description: v.string().optional(),
    publishedOn: v.unknown().transform((v) => new Date(v as string)),
    authorId: v.string(),
  }),
})
