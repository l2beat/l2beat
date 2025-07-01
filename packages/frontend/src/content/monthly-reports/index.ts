import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const news = v.object({
  title: v.string(),
  content: v.string(),
  tags: v
    .array(v.union([v.literal('upcoming'), v.literal('governance')]))
    .optional(),
})

const ecosystemReport = v.object({
  name: v.string(),
  type: v.literal('ecosystem'),
  ecosystemId: v.string(),
  newProjectsIds: v.array(v.string()).optional(),
  news: v.array(news).optional(),
})

const dataAvailabilityReport = v.object({
  name: v.string(),
  type: v.literal('data-availability'),
  daLayerId: v.string(),
  newProjectsIds: v.array(v.string()).optional(),
  news: v.array(news).optional(),
})

const upcomingProjectReport = v.object({
  name: v.string(),
  type: v.literal('upcoming-project'),
  projectId: v.string(),
  news: v.array(news).optional(),
})

const monthlyReport = v.object({
  title: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  reports: v.array(
    v.union([ecosystemReport, dataAvailabilityReport, upcomingProjectReport]),
  ),
})

export const monthlyReportsCollection = defineCollection({
  type: 'data',
  schema: monthlyReport,
})
