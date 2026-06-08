import { v } from '@l2beat/validate'

const UnknownRecord = v.record(v.string(), v.unknown())

export const ApiAnalyzerSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
  version: v.string(),
  command: v.array(v.string()),
  timeoutMs: v.number(),
  cacheable: v.boolean(),
})

export const ApiAnalyzersSchema = v.array(ApiAnalyzerSchema)

export const ApiAnalyzerResultSchema = v.union([
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

export type ApiAnalyzer = v.infer<typeof ApiAnalyzerSchema>
export type ApiAnalyzerResult = v.infer<typeof ApiAnalyzerResultSchema>
