import { describe, expect, it } from 'vitest'
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
    expect(buildMarker(review([], { context_sources: ['a', 'b'] }), meta)).toBe(
      '<!-- ai-review run=r1 lessons=none engine=codex sources=a,b -->',
    )
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
    expect(payload.event).toBe('COMMENT')
    expect(payload.commit_id).toBe('sha1')
    expect(payload.comments.map((c) => [c.path, c.start_line, c.line])).toEqual(
      [
        ['src/a.ts', 2, 3],
        ['src/a.ts', undefined, 4],
      ],
    )
    expect(payload.comments[0].body).toContain(
      '**[major/correctness]** inline-range — `src/a.ts:2-3`',
    )
    expect(payload.body).toContain('4 finding(s); 2 inline. 2 listed here:')
    expect(payload.body).toContain('no-location')
    expect(payload.body).toContain('file-only — `src/c.ts`')
    expect(payload.body).not.toContain('inline-single')
  })

  it('inline: false flattens every finding into the body', () => {
    const payload = buildReview(
      review([
        finding({ location: at('src/a.ts', 2, 3), claim: 'has-lines' }),
        finding({ claim: 'no-location' }),
      ]),
      meta,
      { inline: false },
    )
    expect(payload.comments).toEqual([])
    expect(payload.body).toContain('2 finding(s); 0 inline. 2 listed here:')
    expect(payload.body).toContain('has-lines — `src/a.ts:2-3`')
    expect(payload.body).toContain('no-location')
  })

  it('zero findings posts the explicit no-findings body', () => {
    const r = review([])
    const payload = buildReview(r, meta)
    expect(payload.comments).toEqual([])
    expect(payload.body).toContain(
      'Reviewed, consulted `diff`, no findings above the bar.',
    )
    expect(payload.body.trim().endsWith(buildMarker(r, meta))).toBe(true)
  })

  it('aborted review posts the abort reason and no findings', () => {
    const payload = buildReview(
      review([], { aborted: 'timeout: killed after 60000ms' }),
      meta,
    )
    expect(payload.body).toContain(
      'Review aborted: timeout: killed after 60000ms',
    )
    expect(payload.body).not.toContain('no findings above the bar')
    expect(payload.body).toContain('<!-- ai-review run=r1')
  })

  it('puts token spend in the footer when reported', () => {
    expect(buildReview(review([], { tokens: 12345 }), meta).body).toContain(
      '· tokens 12345</sub>',
    )
    expect(buildReview(review([]), meta).body).not.toContain('tokens')
  })

  it('lists executed commands', () => {
    const payload = buildReview(
      review([], { commands: ['pnpm -F x typecheck'] }),
      meta,
    )
    expect(payload.body).toContain('- `pnpm -F x typecheck`')
  })
})
