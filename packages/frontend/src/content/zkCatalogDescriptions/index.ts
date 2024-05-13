import { z } from 'zod'

import { defineCollection } from '../defineCollection'

export const zkCatalogDescriptionsCollection = defineCollection({
  type: 'content',
  schema: z.object({}).strict(),
})
