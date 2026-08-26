import { expect } from 'earl'
import { buildComment, buildMarker } from './buildComment.js'
import { ReviewOutput, type RunMeta } from './schema.js'

const meta: RunMeta = { run_id: '123', lessons_version: 'none', engine: 'stub' }

describe(buildComment.name, () => {
  it('renders the no-findings stub with a footer marker', () => {
    const review: ReviewOutput = {
      intent: 'Adds a gate.',
      findings: [],
      context_sources: ['diff', 'linear:L2B-1'],
    }
    const comment = buildComment(review, meta)
    expect(comment).toInclude('Adds a gate.')
    expect(comment).toInclude(
      'Reviewed, consulted `diff`, `linear:L2B-1`, no findings above the bar.',
    )
    expect(comment.trim().endsWith(buildMarker(review, meta))).toEqual(true)
  })

  it('renders findings with location, evidence and fix', () => {
    const review: ReviewOutput = {
      intent: 'x',
      findings: [
        {
          file: 'src/a.ts',
          line_start: 3,
          severity: 'major',
          category: 'correctness',
          claim: 'off by one',
          evidence: 'src/a.ts:3',
          fix_sketch: 'use <=',
          confidence: 0.9,
        },
        {
          severity: 'major',
          category: 'intent-missing',
          claim: 'no issue linked',
          evidence: 'PR description',
          fix_sketch: 'link issue',
          confidence: 1,
        },
      ],
      context_sources: [],
    }
    const comment = buildComment(review, meta)
    expect(comment).toInclude(
      '### 1. [major/correctness] off by one — `src/a.ts:3`',
    )
    expect(comment).toInclude('### 2. [major/intent-missing] no issue linked\n')
    expect(comment).not.toInclude('no findings above the bar')
  })
})

describe(buildMarker.name, () => {
  it('carries run id, lessons version, engine and sources', () => {
    const marker = buildMarker(
      { intent: '', findings: [], context_sources: ['a', 'b'] },
      meta,
    )
    expect(marker).toEqual(
      '<!-- ai-review run=123 lessons=none engine=stub sources=a,b -->',
    )
  })
})

describe('ReviewOutput schema', () => {
  it('rejects unknown severity', () => {
    const result = ReviewOutput.safeValidate({
      intent: 'x',
      findings: [
        {
          severity: 'critical',
          category: 'perf',
          claim: '',
          evidence: '',
          fix_sketch: '',
          confidence: 0,
        },
      ],
      context_sources: [],
    })
    expect(result.success).toEqual(false)
  })
})
