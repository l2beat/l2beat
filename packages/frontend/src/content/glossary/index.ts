import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

export const glossaryCollection = defineCollection({
  type: 'data',
  schema: v.object({
    term: v.string(),
    match: v.array(v.string()).optional(),
    definition: v.string(),
    isSpicy: v.boolean(),
  }),
})
