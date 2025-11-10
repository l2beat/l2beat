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
  type: v.literal('ecosystem'),
  ecosystemId: v.string(),
  newProjectsIds: v.array(v.string()).optional(),
  news: v.array(news).check((v) => v.length > 0),
})
export type EcosystemUpdate = v.infer<typeof ecosystemUpdate>

const dataAvailabilityUpdate = v.object({
  type: v.literal('data-availability'),
  id: v.string(),
  daLayerId: v.string(),
  name: v.string().optional(),
  newProjectsIds: v.array(v.string()).optional(),
  news: v.array(news).check((v) => v.length > 0),
})
export type DataAvailabilityUpdate = v.infer<typeof dataAvailabilityUpdate>

const upcomingProjectUpdate = v.object({
  name: v.string(),
  type: v.literal('upcoming-project'),
  projectId: v.string(),
  news: v.array(news).check((v) => v.length > 0),
})
export type UpcomingProjectUpdate = v.infer<typeof upcomingProjectUpdate>

const monthlyUpdate = v.object({
  title: v.string(),
  description: v.string().optional(),
  startDate: v.unknown().transform((v) => new Date(v as string)),
  endDate: v.unknown().transform((v) => new Date(v as string)),
  publishedOn: v.unknown().transform((v) => new Date(v as string)),
  updates: v.array(
    v.union([ecosystemUpdate, dataAvailabilityUpdate, upcomingProjectUpdate]),
  ),
})

export const monthlyUpdatesCollection = defineCollection({
  type: 'data',
  schema: monthlyUpdate,
})
