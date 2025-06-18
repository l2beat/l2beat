import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

export const pagesCollection = defineCollection({
  type: 'content',
  schema: v.object({
    lastUpdated: v.unknown().transform((v) => new Date(v as string)),
  }),
})
