import { v } from '@l2beat/validate'

export const Severity = v.enum(['blocker', 'major', 'minor'])
export const Category = v.enum([
  'correctness',
  'security',
  'perf',
  'convention',
  'test-gap',
  'intent-mismatch',
  'intent-missing',
])

/** Inclusive right-side line range; start <= end, both >= 1. */
export const LineRange = v.object({ start: v.number(), end: v.number() })
export type LineRange = v.infer<typeof LineRange>

/** Repo-relative file, optionally narrowed to a line range. */
export const Location = v.object({
  file: v.string(),
  range: LineRange.optional(),
})
export type Location = v.infer<typeof Location>

export const Finding = v.object({
  location: Location.optional(),
  severity: Severity,
  category: Category,
  claim: v.string(),
  evidence: v.string(),
  fix_sketch: v.string(),
  confidence: v.number(),
})
export type Finding = v.infer<typeof Finding>

export const ReviewOutput = v.object({
  intent: v.string(),
  findings: v.array(Finding),
  context_sources: v.array(v.string()),
  commands: v.array(v.string()).optional(),
  aborted: v.string().optional(),
})
export type ReviewOutput = v.infer<typeof ReviewOutput>

export const RunMeta = v.object({
  run_id: v.string(),
  lessons_version: v.string(),
  engine: v.string(),
  /** Reviewed head; pins inline comments so a push mid-review does not shift them. */
  commit_id: v.string(),
})
export type RunMeta = v.infer<typeof RunMeta>
