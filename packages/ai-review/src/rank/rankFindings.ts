import type { Finding } from '../post/schema.js'

export const MAX_FINDINGS = 5

const SEVERITY_WEIGHT: Record<Finding['severity'], number> = {
  blocker: 3,
  major: 2,
  minor: 1,
}

export function score(f: Finding): number {
  return SEVERITY_WEIGHT[f.severity] * f.confidence
}

export function rankFindings(
  findings: Finding[],
  cap = MAX_FINDINGS,
): Finding[] {
  const seen = new Map<string, Finding>()
  for (const f of findings) {
    if (!f.evidence.trim() || !f.fix_sketch.trim()) continue
    const key = `${f.file ?? ''}:${f.line_start ?? ''}:${f.category}`
    const prev = seen.get(key)
    if (!prev || score(f) > score(prev)) seen.set(key, f)
  }
  return [...seen.values()].sort((a, b) => score(b) - score(a)).slice(0, cap)
}
