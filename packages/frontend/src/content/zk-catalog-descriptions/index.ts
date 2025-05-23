import { z } from 'zod/v4'

import { defineCollection } from '../define-collections'

export const zkCatalogDescriptionsCollection = defineCollection({
  type: 'content',
  schema: z.object({}).strict(),
})
