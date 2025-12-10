import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const tags = v.union([v.literal('OTHERS'), v.literal('RESEARCH')])
export type ExternalPublicationTag = v.infer<typeof tags>

const externalPublication = v.object({
  title: v.string(),
  description: v.string().optional(),
  publishedOn: v.unknown().transform((v) => new Date(v as string)),
  url: v.string().check((v) => {
    // Allow relative paths
    if (v.startsWith('/')) return true
    return !!new URL(v)
  }),
  ctaText: v.union([v.literal('Read now'), v.literal('Watch now')]).optional(),
  tag: tags,
})

export const externalPublicationsCollection = defineCollection({
  type: 'data',
  schema: externalPublication,
})
