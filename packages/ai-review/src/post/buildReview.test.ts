import { expect } from 'earl'
import { buildMarker, buildReview } from './buildReview.js'
import type { Finding, Location, ReviewOutput, RunMeta } from './schema.js'

const meta: RunMeta = {
  run_id: 'r1',
  lessons_version: 'none',
  engine: 'codex',
  commit_id: 'sha1',
}

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
  it('puts findings with lines inline and the rest top-level', () => {
    const payload = buildReview(
      review([
        finding({ location: at('src/a.ts', 2, 3), claim: 'inline-range' }),
        finding({ location: at('src/a.ts', 4), claim: 'inline-single' }),
        finding({ location: at('src/c.ts'), claim: 'file-only' }),
        finding({ category: 'intent-missing', claim: 'no-location' }),
      ]),
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
    expect(payload.body).toInclude('4 finding(s); 2 inline. 2 without a line:')
    expect(payload.body).toInclude('no-location')
    expect(payload.body).toInclude('file-only — `src/c.ts`')
    expect(payload.body).not.toInclude('inline-single')
  })

  it('zero findings posts the explicit no-findings body', () => {
    const r = review([])
    const payload = buildReview(r, meta)
    expect(payload.comments).toEqual([])
    expect(payload.body).toInclude(
      'Reviewed, consulted `diff`, no findings above the bar.',
    )
    expect(payload.body.trim().endsWith(buildMarker(r, meta))).toEqual(true)
  })

  it('aborted review posts the abort reason and no findings', () => {
    const payload = buildReview(
      review([], { aborted: 'timeout: killed after 60000ms' }),
      meta,
    )
    expect(payload.body).toInclude(
      'Review aborted: timeout: killed after 60000ms',
    )
    expect(payload.body).not.toInclude('no findings above the bar')
    expect(payload.body).toInclude('<!-- ai-review run=r1')
  })

  it('lists executed commands', () => {
    const payload = buildReview(
      review([], { commands: ['pnpm -F x typecheck'] }),
      meta,
    )
    expect(payload.body).toInclude('- `pnpm -F x typecheck`')
  })
})
