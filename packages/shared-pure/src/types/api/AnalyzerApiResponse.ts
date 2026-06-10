import { v } from '@l2beat/validate'

const UnknownRecord = v.record(v.string(), v.unknown())

export const AnalyzerApiResponse = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
  version: v.string(),
  command: v.array(v.string()),
  timeoutMs: v.number(),
  cacheable: v.boolean(),
})
export type AnalyzerApiResponse = v.infer<typeof AnalyzerApiResponse>

export const AnalyzersApiResponse = v.array(AnalyzerApiResponse)
export type AnalyzersApiResponse = v.infer<typeof AnalyzersApiResponse>

export const AnalyzerResultApiResponse = v.union([
  v.object({
    status: v.literal('ok'),
    output: v.object({
      text: v.string(),
      data: UnknownRecord.optional(),
    }),
    metadata: UnknownRecord.optional(),
  }),
  v.object({
    status: v.literal('error'),
    error: v.object({
      type: v.string(),
      message: v.string(),
      details: UnknownRecord.optional(),
    }),
    metadata: UnknownRecord.optional(),
  }),
])
export type AnalyzerResultApiResponse = v.infer<
  typeof AnalyzerResultApiResponse
>
