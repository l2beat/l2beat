import { v } from '@l2beat/validate'

export const FLAT_SOURCES_ZSTD_WINDOW_LOG = 27

export const FlatSourcesApiHeader = v.object({
  projectCount: v.number(),
})
export type FlatSourcesApiHeader = v.infer<typeof FlatSourcesApiHeader>

export const FlatSourcesApiEntry = v.object({
  projectId: v.string(),
  timestamp: v.number(),
  contentHash: v.string(),
  flat: v.record(v.string(), v.string()),
})
export type FlatSourcesApiEntry = v.infer<typeof FlatSourcesApiEntry>
