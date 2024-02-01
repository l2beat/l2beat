import { z } from 'zod'

const publications = {
  schema: z.object({
    title: z.string(),
    link: z.string(),
    publishedOn: z.coerce.date(),
  }),
} as const

const delegatedProjects = {
  schema: z.object({
    name: z.string(),
    delegateTokensUrl: z.string().url(),
  }),
} as const

const events = {
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('one-time'),
      highlighted: z.boolean().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      location: z.string(),
      link: z.string().url(),
    }),
    z.object({
      type: z.literal('recurring'),
      highlighted: z.boolean().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      cancelledAt: z.array(z.coerce.date()).optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      dayOfWeek: z.number().min(0).max(6),
      startHour: z.number().min(0).max(23),
      startMinute: z.number().min(0).max(59),
      endHour: z.number().min(0).max(23),
      endMinute: z.number().min(0).max(59),
      futureEventsCount: z.number().min(1),
      location: z.string(),
      link: z.string().url(),
    }),
  ]),
} as const

export const content = {
  publications,
  delegatedProjects,
  events,
}
