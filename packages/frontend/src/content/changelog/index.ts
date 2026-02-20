import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const whatsNew = v.object({
  image: v.string(),
  alt: v.string(),
  href: v.string().optional(),
  mobileDisabledOnMatches: v.array(v.string()).optional(),
  expiresAt: v.unknown().transform((value) => new Date(value as string)),
})

const changelog = v
  .object({
    title: v.string(),
    summary: v.string().optional(),
    publishedAt: v.unknown().transform((value) => new Date(value as string)),
    whatsNew: whatsNew.optional(),
  })
  .check(
    (entry) => !entry.whatsNew || entry.whatsNew.expiresAt > entry.publishedAt,
  )

export type ChangelogEntryData = v.infer<typeof changelog>

export const changelogCollection = defineCollection({
  type: 'content',
  schema: changelog,
})
