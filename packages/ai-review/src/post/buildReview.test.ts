import { expect } from 'earl'
import { parseDiffLines } from '../diff/parseDiff.js'
import { buildMarker, buildReview } from './buildReview.js'
import type { Finding, Location, ReviewOutput, RunMeta } from './schema.js'

const meta: RunMeta = {
  run_id: 'r1',
  lessons_version: 'none',
  engine: 'codex',
  commit_id: 'sha1',
}
const diff = parseDiffLines(`diff --git a/src/a.ts b/src/a.ts
--- a/src/a.ts
+++ b/src/a.ts
@@ -1,2 +1,4 @@
 x
+l2
+l3
+l4
`)

function at(file: string, start?: number, end = start): Location {
  return { file, range: start ? { start, end: end ?? start } : undefined }
}

function finding(overrides: Partial<Finding>): Finding {
  return {
    severity: 'major',
    category: 'correctness',
    claim: 'claim',
    evidence: 'ev',
    fix_sketch: 'fix',
    confidence: 0.8,
    ...overrides,
  }
}

function review(
  findings: Finding[],
  extra: Partial<ReviewOutput> = {},
): ReviewOutput {
  return { intent: 'Adds x.', findings, context_sources: ['diff'], ...extra }
}

describe(buildMarker.name, () => {
  it('carries run id, lessons version, engine and sources', () => {
    expect(
      buildMarker(review([], { context_sources: ['a', 'b'] }), meta),
    ).toEqual('<!-- ai-review run=r1 lessons=none engine=codex sources=a,b -->')
  })
})

describe(buildReview.name, () => {
  it('puts in-diff findings inline and the rest top-level', () => {
    const payload = buildReview(
      review([
        finding({ location: at('src/a.ts', 2, 3), claim: 'inline-range' }),
        finding({ location: at('src/a.ts', 4), claim: 'inline-single' }),
        finding({ location: at('src/a.ts', 1), claim: 'context-line' }),
        finding({ location: at('src/b.ts', 1), claim: 'other-file' }),
        finding({ location: at('src/c.ts'), claim: 'file-only' }),
        finding({ category: 'intent-missing', claim: 'no-location' }),
      ]),
      diff,
      meta,
    )
    expect(payload.event).toEqual('COMMENT')
    expect(payload.commit_id).toEqual('sha1')
    expect(payload.comments.map((c) => [c.path, c.start_line, c.line])).toEqual(
      [
        ['src/a.ts', 2, 3],
        ['src/a.ts', undefined, 4],
      ],
    )
    expect(payload.comments[0].body).toInclude(
      '**[major/correctness]** inline-range — `src/a.ts:2-3`',
    )
    expect(payload.body).toInclude(
      '6 finding(s); 2 inline. 4 outside the diff:',
    )
    expect(payload.body).toInclude('context-line')
    expect(payload.body).toInclude('other-file')
    expect(payload.body).toInclude('no-location')
    expect(payload.body).toInclude('file-only — `src/c.ts`')
    expect(payload.body).not.toInclude('inline-single')
  })

  it('zero findings posts the explicit no-findings body', () => {
    const r = review([])
    const payload = buildReview(r, diff, meta)
    expect(payload.comments).toEqual([])
    expect(payload.body).toInclude(
      'Reviewed, consulted `diff`, no findings above the bar.',
    )
    expect(payload.body.trim().endsWith(buildMarker(r, meta))).toEqual(true)
  })

  it('aborted review posts the abort reason and no findings', () => {
    const payload = buildReview(
      review([], { aborted: 'over-budget: 9 > 1' }),
      diff,
      meta,
    )
    expect(payload.body).toInclude('Review aborted: over-budget: 9 > 1')
    expect(payload.body).not.toInclude('no findings above the bar')
    expect(payload.body).toInclude('<!-- ai-review run=r1')
  })

  it('lists executed commands', () => {
    const payload = buildReview(
      review([], { commands: ['pnpm -F x typecheck'] }),
      diff,
      meta,
    )
    expect(payload.body).toInclude('- `pnpm -F x typecheck`')
  })
})
