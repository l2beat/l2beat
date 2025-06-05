import { z } from 'zod'

import { defineCollection } from '../defineCollections'

export const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lastUpdated: z.coerce.date(),
  }),
})
