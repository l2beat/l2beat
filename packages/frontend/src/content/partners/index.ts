import { z } from 'zod'

import { defineCollection } from '../defineCollections'

export const partnersCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    tier: z.enum(['ecosystem', 'innovator', 'supporter']),
    logo: z.string().optional(),
    link: z.string().optional(),
  }),
})
