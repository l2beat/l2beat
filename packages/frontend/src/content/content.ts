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
  schema: z.object({
    title: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.string(),
    link: z.string().url(),
  }),
} as const

export const content = {
  publications,
  delegatedProjects,
  events,
}
