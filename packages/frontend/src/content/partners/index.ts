import { z } from 'zod'

import { defineCollection } from '../defineCollections'

export const partnersCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tier: z.object({
      slug: z.string(),
      tier: z.enum(['ecosystem', 'innovator', 'supporter']),
      logo: z.string().optional(),
      link: z.string().optional(),
    }),
    logo: z.string(),
    link: z.string().optional(),
  }),
})
