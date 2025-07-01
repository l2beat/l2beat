import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const news = v.object({
  title: v.string(),
  content: v.string(),
  tags: v
    .array(v.union([v.literal('upcoming'), v.literal('governance')]))
    .optional(),
})
export type News = v.infer<typeof news>

const ecosystemUpdate = v.object({
  name: v.string(),
  type: v.literal('ecosystem'),
  ecosystemId: v.string(),
  newProjectsIds: v.array(v.string()).optional(),
  news: v.array(news).optional(),
})
export type EcosystemUpdate = v.infer<typeof ecosystemUpdate>

const dataAvailabilityUpdate = v.object({
  name: v.string(),
  type: v.literal('data-availability'),
  daLayerId: v.string(),
  newProjectsIds: v.array(v.string()).optional(),
  news: v.array(news).optional(),
})

const upcomingProjectUpdate = v.object({
  name: v.string(),
  type: v.literal('upcoming-project'),
  projectId: v.string(),
  news: v.array(news).optional(),
})

const monthlyUpdate = v.object({
  title: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  publishedOn: v.unknown().transform((v) => new Date(v as string)),
  updates: v.array(
    v.union([ecosystemUpdate, dataAvailabilityUpdate, upcomingProjectUpdate]),
  ),
})

export const monthlyUpdatesCollection = defineCollection({
  type: 'data',
  schema: monthlyUpdate,
})
