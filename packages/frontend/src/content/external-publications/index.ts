import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const tags = v.union([v.literal('Others'), v.literal('Research')])
export type ExternalPublicationTag = v.infer<typeof tags>

const topics = v.array(v.literal('native-rollups'))
export type ExternalPublicationTopic = v.infer<typeof topics>[number]

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
  // Attribution line shown on topic pages, e.g. "Luca Donno · L2BEAT"
  source: v.string().optional(),
  // Topic pages pull tagged publications, e.g. talks on /native-rollups
  topics: topics.optional(),
})

export const externalPublicationsCollection = defineCollection({
  type: 'data',
  schema: externalPublication,
})
