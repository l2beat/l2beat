import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

export const delegatedProjectsCollection = defineCollection({
  type: 'data',
  schema: v.object({
    name: v.string(),
    slug: v.string(),
    delegateTokensUrl: v.string().check((v) => !!new URL(v)),
  }),
})
