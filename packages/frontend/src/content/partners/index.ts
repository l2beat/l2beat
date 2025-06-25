import { z } from 'zod'

import { defineCollection } from '../defineCollections'

const ecosystemPartner = z.object({
  slug: z.string(),
  tier: z.literal('ecosystem'),
})

const innovatorPartner = z.object({
  slug: z.string(),
  tier: z.literal('innovator'),
  link: z.string().optional(),
})

const supporterPartner = z.object({
  slug: z.string(),
  name: z.string(),
  tier: z.literal('supporter'),
  link: z.string().optional(),
})

export const partnersCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('tier', [
    ecosystemPartner,
    innovatorPartner,
    supporterPartner,
  ]),
})
