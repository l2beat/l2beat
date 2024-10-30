import { z } from 'zod'

import { defineCollection } from '../define-collections'

export const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    lastUpdated: z.coerce.date(),
  }),
})
