import { z } from 'zod/v4'

import { defineCollection } from '../define-collections'

export const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lastUpdated: z.coerce.date(),
  }),
})
