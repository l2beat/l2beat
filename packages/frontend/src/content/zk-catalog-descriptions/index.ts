import { z } from 'zod'

import { defineCollection } from '../defineCollections'

export const zkCatalogDescriptionsCollection = defineCollection({
  type: 'content',
  schema: z.object({}).strict(),
})
