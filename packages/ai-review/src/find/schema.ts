import { toJsonSchema, v } from '@l2beat/validate'
import { Category, type Finding, Severity } from '../post/schema.js'

// The engine is forced to emit exactly this shape (see FIND_OUTPUT_SCHEMA).
// OpenAI strict schemas require every property; absent values are null.
export const FindOutput = v.strictObject({
  intent: v.string(),
  findings: v.array(
    v.strictObject({
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

/** JSON Schema handed to the engine; derived so it cannot drift from the validator. */
export const FIND_OUTPUT_SCHEMA = toJsonSchema(FindOutput)

export function toFindings(output: FindOutput): Finding[] {
  return output.findings.map(({ file, line_start, line_end, ...rest }) => ({
    ...rest,
    location: file
      ? { file, range: normalizeRange(line_start, line_end) }
      : undefined,
    confidence: Math.min(1, Math.max(0, rest.confidence)),
  }))
}

function normalizeRange(start: number | null, end: number | null) {
  const s = start ?? end
  if (!s || s < 1) return undefined
  const e = end ?? s
  return e >= s ? { start: s, end: e } : { start: e, end: s }
}
