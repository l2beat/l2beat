import { v } from '@l2beat/validate'

import { defineCollection } from '../defineCollections'

const OneTimeEvent = v.object({
  type: v.literal('one-time'),
  highlighted: v.boolean().optional(),
  title: v.string(),
  subtitle: v.string().optional(),
  startDate: v.unknown().transform((v) => new Date(v as string)),
  endDate: v
    .unknown()
    .transform((v) => new Date(v as string))
    .optional(),
  location: v.string().optional(),
  link: v.string().check((v) => !!new URL(v)),
  toBeAnnounced: v.boolean().optional(),
})

const RecurringEvent = v.object({
  type: v.literal('recurring'),
  title: v.string(),
  subtitle: v.string().optional(),
  sinceDate: v.unknown().transform((v) => new Date(v as string)),
  tillDate: v
    .unknown()
    .transform((v) => new Date(v as string))
    .optional(),
  futureEventsCount: v.number().check((v) => v > 0),
  dayOfWeek: v.number().check((v) => v >= 0 && v <= 6),
  startDate: v.object({
    hour: v.number().check((v) => v >= 0 && v <= 23),
    minute: v.number().check((v) => v >= 0 && v <= 59),
  }),
  endDate: v
    .object({
      hour: v.number().check((v) => v >= 0 && v <= 23),
      minute: v.number().check((v) => v >= 0 && v <= 59),
    })
    .optional(),
  location: v.string().optional(),
  link: v.string().check((v) => !!new URL(v)),
  cancelledAt: v
    .array(v.unknown().transform((v) => new Date(v as string)))
    .optional(),
})

export const eventsCollection = defineCollection({
  type: 'data',
  // NOTE(radomski): Was a discriminatedUnion but l2beat/validate does not
  // support it yet. It's a performance issue.
  schema: v.union([OneTimeEvent, RecurringEvent]),
})
