import { v } from '@l2beat/validate'

export const Finding = v.object({
  file: v.string().optional(),
  line_start: v.number().optional(),
  line_end: v.number().optional(),
  severity: v.enum(['blocker', 'major', 'minor']),
  category: v.enum([
    'correctness',
    'security',
    'perf',
    'convention',
    'test-gap',
    'intent-mismatch',
    'intent-missing',
  ]),
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
})
export type ReviewOutput = v.infer<typeof ReviewOutput>

export const RunMeta = v.object({
  run_id: v.string(),
  lessons_version: v.string(),
  engine: v.string(),
})
export type RunMeta = v.infer<typeof RunMeta>
