import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const ecosystemReport = v.object({
  name: v.string(),
  type: v.literal('ecosystem'),
  ecosystemId: v.string(),
  newProjects: v.array(v.string()).optional(),
  upcoming: v.string().optional(),
  news: v.string().optional(),
  governance: v.string().optional(),
})

const dataAvailabilityReport = v.object({
  name: v.string(),
  type: v.literal('data-availability'),
  daLayer: v.string(),
  newProjects: v.array(v.string()).optional(),
  upcoming: v.string().optional(),
  news: v.string().optional(),
  governance: v.string().optional(),
})

const scalingProjectReport = v.object({
  name: v.string(),
  type: v.literal('scaling-project'),
  projectId: v.string(),
  upcoming: v.string().optional(),
  news: v.string().optional(),
  governance: v.string().optional(),
})

const monthlyReport = v.object({
  title: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  reports: v.array(
    v.union([ecosystemReport, dataAvailabilityReport, scalingProjectReport]),
  ),
})

export const monthlyReportsCollection = defineCollection({
  type: 'data',
  schema: monthlyReport,
})
