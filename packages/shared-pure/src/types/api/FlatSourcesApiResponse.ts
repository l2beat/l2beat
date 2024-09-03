import z from 'zod'

export const FlatSourcesApiResponse = z.array(
  z.object({
    projectName: z.string(),
    chainName: z.string(),
    blockNumber: z.number(),
    contentHash: z.string(),
    flat: z.record(z.string()),
  }),
)
export type FlatSourcesApiResponse = z.infer<typeof FlatSourcesApiResponse>
