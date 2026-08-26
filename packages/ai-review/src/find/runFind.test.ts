import { expect } from 'earl'
import { StubEngine } from '../engine/stub/StubEngine.js'
import type { Engine } from '../engine/types.js'
import { ReviewOutput } from '../post/schema.js'
import { rankFindings } from '../rank/rankFindings.js'
import { runFind } from './runFind.js'

const input = {
  cwd: '.',
  prompt: 'p',
  outputSchema: {},
  budget: { maxTokens: 1, timeoutMs: 1 },
}

function rawFinding(i: number, severity = 'minor', confidence = 0.5) {
  return {
    file: 'a.ts',
    line_start: i,
    line_end: null,
    severity,
    category: 'correctness',
    claim: `c${i}`,
    evidence: 'e',
    fix_sketch: 'f',
    confidence,
  }
}

describe(runFind.name, () => {
  it('contract: output is schema-valid, capped at 5, ranked', async () => {
    const findings = [
      rawFinding(1, 'minor', 1),
      rawFinding(2, 'blocker', 0.9),
      rawFinding(3, 'major', 0.9),
      rawFinding(4),
      rawFinding(5),
      rawFinding(6),
      rawFinding(7),
    ]
    const { review } = await runFind(
      new StubEngine({ intent: 'does x', findings }),
      input,
    )
    expect(ReviewOutput.isValid(review)).toEqual(true)
    expect(review.findings).toHaveLength(5)
    expect(review.findings.map((f) => f.claim).slice(0, 3)).toEqual([
      'c2',
      'c3',
      'c1',
    ])
    expect(review.intent).toEqual('does x')
    expect(review.aborted).toEqual(undefined)
  })

  it('marks the review aborted when the engine fails', async () => {
    const failing: Engine = {
      name: 'x',
      run: () =>
        Promise.resolve({ ok: false, reason: 'over-budget', detail: '9 > 1' }),
    }
    const { review } = await runFind(failing, input)
    expect(review.aborted).toEqual('over-budget: 9 > 1')
    expect(review.findings).toEqual([])
    expect(ReviewOutput.isValid(review)).toEqual(true)
  })

  it('marks the review aborted on schema-invalid engine output', async () => {
    const { review } = await runFind(
      new StubEngine({ intent: 'x', findings: [{ severity: 'huge' }] }),
      input,
    )
    expect(review.aborted).toBeA(String)
    expect(review.aborted?.startsWith('invalid-output')).toEqual(true)
  })

  it('normalizes reversed and non-positive line ranges', async () => {
    const findings = [
      { ...rawFinding(3), line_end: 2 },
      { ...rawFinding(0), line_end: null, claim: 'zero' },
      { ...rawFinding(1), line_start: null, line_end: 7, claim: 'end-only' },
    ]
    const { review } = await runFind(
      new StubEngine({ intent: 'x', findings }),
      input,
    )
    const byClaim = Object.fromEntries(review.findings.map((f) => [f.claim, f]))
    expect([byClaim.c3.line_start, byClaim.c3.line_end]).toEqual([2, 3])
    expect([byClaim.zero.line_start, byClaim.zero.line_end]).toEqual([
      undefined,
      undefined,
    ])
    expect([
      byClaim['end-only'].line_start,
      byClaim['end-only'].line_end,
    ]).toEqual([7, 7])
  })

  it('rank stage is what orders the output', async () => {
    const findings = [rawFinding(1, 'minor', 0.1), rawFinding(2, 'blocker', 1)]
    const { review } = await runFind(
      new StubEngine({ intent: 'x', findings }),
      input,
    )
    const expected = rankFindings(review.findings)
    expect(review.findings).toEqual(expected)
  })
})
