import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

export const authorsCollection = defineCollection({
  type: 'data',
  schema: v.object({
    firstName: v.string(),
    lastName: v.string(),
    role: v.string(),
  }),
})
