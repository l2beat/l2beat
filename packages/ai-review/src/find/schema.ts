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
  return output.findings.map((f) => {
    const range = normalizeRange(f.line_start, f.line_end)
    return {
      ...f,
      file: f.file ?? undefined,
      line_start: range?.start,
      line_end: range?.end,
      confidence: Math.min(1, Math.max(0, f.confidence)),
    }
  })
}

function normalizeRange(start: number | null, end: number | null) {
  const s = start ?? end
  if (!s || s < 1) return undefined
  const e = end ?? s
  return e >= s ? { start: s, end: e } : { start: e, end: s }
}
