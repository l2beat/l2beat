import { z } from 'zod'

import { defineCollection } from '../defineCollection'

export const delegatedProjectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    delegateTokensUrl: z.string().url(),
  }),
})
