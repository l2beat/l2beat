import { z } from 'zod'

import { defineCollection } from '../define-collections'

export const zkCatalogDescriptionsCollection = defineCollection({
  type: 'content',
  schema: z.object({}).strict(),
})
