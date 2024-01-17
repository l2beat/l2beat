import { defineCollection, z } from 'astro:content';

const delegatedProjectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    projectName: z.string(),
    communicationThreadUrl: z.string().url(),
    delegateTokensUrl: z.string().url(),
  })
});

export const collections = {
  'delegatedProjects': delegatedProjectsCollection,
};