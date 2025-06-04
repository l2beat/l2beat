import { z } from 'zod'

import { defineCollection } from '../defineCollections'

export const delegatedProjectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    delegateTokensUrl: z.string().url(),
  }),
})
