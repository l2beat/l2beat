import { expect } from 'earl'
import type { Finding } from '../post/schema.js'
import { rankFindings, score } from './rankFindings.js'

function finding(overrides: Partial<Finding> & { line?: number }): Finding {
  const { line = 1, ...rest } = overrides
  return {
    location: { file: 'a.ts', range: { start: line, end: line } },
    severity: 'minor',
    category: 'correctness',
    claim: 'c',
    evidence: 'e',
    fix_sketch: 'f',
    confidence: 0.5,
    ...rest,
  }
}

describe(rankFindings.name, () => {
  it('orders by severity × confidence', () => {
    const ranked = rankFindings([
      finding({ claim: 'minor-high', severity: 'minor', confidence: 1 }),
      finding({
        claim: 'blocker-low',
        severity: 'blocker',
        confidence: 0.4,
        line: 2,
      }),
      finding({
        claim: 'major-mid',
        severity: 'major',
        confidence: 0.7,
        line: 3,
      }),
    ])
    expect(ranked.map((f) => f.claim)).toEqual([
      'major-mid',
      'blocker-low',
      'minor-high',
    ])
    expect(score(ranked[0])).toEqual(1.4)
  })

  it('caps at 5', () => {
    const many = Array.from({ length: 8 }, (_, i) => finding({ line: i }))
    expect(rankFindings(many)).toHaveLength(5)
  })

  it('dedupes same file+line+category keeping the higher score', () => {
    const ranked = rankFindings([
      finding({ claim: 'weak', confidence: 0.2 }),
      finding({ claim: 'strong', confidence: 0.9 }),
      finding({ claim: 'other-category', category: 'perf' }),
    ])
    expect(ranked.map((f) => f.claim)).toEqual(['strong', 'other-category'])
  })

  it('drops findings without evidence or fix sketch', () => {
    const ranked = rankFindings([
      finding({ evidence: ' ' }),
      finding({ fix_sketch: '', line: 2 }),
      finding({ line: 3 }),
    ])
    expect(ranked.map((f) => f.location?.range?.start)).toEqual([3])
  })
})
