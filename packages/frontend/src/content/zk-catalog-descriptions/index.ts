import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

export const zkCatalogDescriptionsCollection = defineCollection({
  type: 'content',
  schema: v.strictObject({}),
})
