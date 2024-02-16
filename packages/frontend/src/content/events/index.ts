import { z } from 'zod'

import { defineCollection } from '../defineCollection'

export const OneTimeEvent = z.object({
  type: z.literal('one-time'),
  highlighted: z.boolean().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string(),
  link: z.string().url(),
})

export const RecurringEvent = z.object({
  type: z.literal('recurring'),
  title: z.string(),
  subtitle: z.string().optional(),
  sinceDate: z.coerce.date(),
  tillDate: z.coerce.date().optional(),
  futureEventsCount: z.number().min(1),
  dayOfWeek: z.number().min(0).max(6),
  startDate: z.object({
    hour: z.number().min(0).max(23),
    minute: z.number().min(0).max(59),
  }),
  endDate: z
    .object({
      hour: z.number().min(0).max(23),
      minute: z.number().min(0).max(59),
    })
    .optional(),
  location: z.string(),
  link: z.string().url(),
  cancelledAt: z.array(z.coerce.date()).optional(),
  toBeAnnounced: z.boolean().optional(),
})

export const eventsCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('type', [OneTimeEvent, RecurringEvent]),
})
