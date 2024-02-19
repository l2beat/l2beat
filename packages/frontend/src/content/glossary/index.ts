import { z } from 'zod'

import { defineCollection } from '../defineCollection'

export const glossaryContent = defineCollection({
  type: 'data',
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    isSpicy: z.boolean(),
  }),
})
