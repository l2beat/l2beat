import { v } from '@l2beat/validate'
import { Category, type Finding, Severity } from '../post/schema.js'

// OpenAI strict schemas require every property; absent values are null.
export const FindOutput = v.object({
  intent: v.string(),
  findings: v.array(
    v.object({
      file: v.union([v.string(), v.null()]),
      line_start: v.union([v.number(), v.null()]),
      line_end: v.union([v.number(), v.null()]),
      severity: Severity,
      category: Category,
      claim: v.string(),
      evidence: v.string(),
      fix_sketch: v.string(),
      confidence: v.number(),
    }),
  ),
})
export type FindOutput = v.infer<typeof FindOutput>

export function toFindings(output: FindOutput): Finding[] {
  return output.findings.map((f) => ({
    ...f,
    file: f.file ?? undefined,
    line_start: f.line_start ?? undefined,
    line_end: f.line_end ?? undefined,
    confidence: Math.min(1, Math.max(0, f.confidence)),
  }))
}
