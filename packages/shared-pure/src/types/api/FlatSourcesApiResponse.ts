import z from 'zod/v4'

export const FlatSourcesApiResponse = z.array(
  z.object({
    projectId: z.string(),
    chainName: z.string(),
    blockNumber: z.number(),
    contentHash: z.string(),
    flat: z.record(z.string(), z.string()),
  }),
)
export type FlatSourcesApiResponse = z.infer<typeof FlatSourcesApiResponse>
