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
      endDate: z.coerce.date().optional(),
      location: z.string(),
      link: z.string().url(),
    }),
    z.object({
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
    }),
  ]),
} as const

export const content = {
  publications,
  delegatedProjects,
  events,
}
