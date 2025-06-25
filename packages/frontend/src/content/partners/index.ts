import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const ecosystemPartner = v.object({
  slug: v.string(),
  tier: v.literal('ecosystem'),
})

const innovatorPartner = v.object({
  slug: v.string(),
  tier: v.literal('innovator'),
  link: v.string().optional(),
})

const supporterPartner = v.object({
  slug: v.string(),
  name: v.string(),
  tier: v.literal('supporter'),
  link: v.string().optional(),
})

export const partnersCollection = defineCollection({
  type: 'data',
  // NOTE(radomski): Was a discriminatedUnion but l2beat/validate does not
  // support it yet. It's a performance issue.
  schema: v.union([ecosystemPartner, innovatorPartner, supporterPartner]),
})
