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
    communicationThreadUrl: z.string().url(),
    delegateTokensUrl: z.string().url(),
  }),
} as const

const events = {
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('one-time'),
      title: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      location: z.string(),
      link: z.string().url(),
    }),
    z.object({
      type: z.literal('recurring'),
      title: z.string(),
      startDate: z.coerce.date(),
      dayOfWeek: z.number().min(0).max(6),
      startHour: z.number().min(0).max(23),
      startMinute: z.number().min(0).max(59),
      endHour: z.number().min(0).max(23),
      endMinute: z.number().min(0).max(59),
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
