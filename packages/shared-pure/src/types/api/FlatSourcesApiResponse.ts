import { v } from '@l2beat/validate'

export const FlatSourcesApiResponse = v.array(
  v.object({
    projectId: v.string(),
    timestamp: v.number(),
    contentHash: v.string(),
    flat: v.record(v.string(), v.string()),
  }),
)
export type FlatSourcesApiResponse = v.infer<typeof FlatSourcesApiResponse>
