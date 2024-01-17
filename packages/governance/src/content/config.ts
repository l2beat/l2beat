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

export const collections = {
  delegatedProjects: delegatedProjects,
  posts: posts,
  authors: authors,
}
