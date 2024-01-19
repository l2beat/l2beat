import { defineCollection, reference, z } from 'astro:content'

const delegatedProjects = defineCollection({
  type: 'data',
  schema: z.object({
    projectName: z.string(),
    communicationThreadUrl: z.string().url(),
    delegateTokensUrl: z.string().url(),
  }),
})

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: reference('authors'),
  }),
})

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    firstName: z.string(),
    lastName: z.string(),
    nickName: z.string(),
  }),
})

const events = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string(),
    link: z.string().url(),
  }),
})

export const collections = {
  delegatedProjects,
  posts,
  authors,
  events,
}
