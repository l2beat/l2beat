import { expect } from 'earl'
import { aggregate, aggregateByStratum, median, scorePr } from './score.js'
import type { DatasetEntry, PrJudgement } from './types.js'

function entry(over: Partial<DatasetEntry>): DatasetEntry {
  return {
    pr: 1,
    url: '',
    title: '',
    author: 'a',
    mergedAt: '',
    headSha: '',
    baseSha: '',
    mergeCommitSha: '',
    stratum: 'backend',
    changedFiles: [],
    linear: null,
    humanComments: [],
    codexFindings: [],
    ...over,
  }
}

const comment = (id: number) => ({
  id,
  author: 'r',
  body: '',
  url: '',
  createdAt: '',
})

describe(scorePr.name, () => {
  it('counts each human comment and finding at most once', () => {
    const e = entry({
      humanComments: [comment(1), comment(2), comment(3)],
      codexFindings: [comment(10), comment(11)],
    })
    const judgement: PrJudgement = {
      pr: 1,
      verdicts: [
        { findingId: 10, humanCommentId: 1, match: true, reason: '' },
        { findingId: 10, humanCommentId: 2, match: true, reason: '' },
        { findingId: 11, humanCommentId: 1, match: true, reason: '' },
        { findingId: 11, humanCommentId: 3, match: false, reason: '' },
      ],
      missingPairs: 0,
      latencyMs: 0,
      cached: false,
    }
    expect(scorePr(e, judgement)).toEqual({
      pr: 1,
      stratum: 'backend',
      humanComments: 3,
      findings: 2,
      matchedHuman: 2,
      matchedFindings: 2,
    })
  })
})

describe(aggregate.name, () => {
  it('computes recall, precision and noise over all PRs', () => {
    const result = aggregate([
      {
        pr: 1,
        stratum: 'backend',
        humanComments: 4,
        findings: 2,
        matchedHuman: 1,
        matchedFindings: 1,
      },
      {
        pr: 2,
        stratum: 'frontend',
        humanComments: 2,
        findings: 4,
        matchedHuman: 2,
        matchedFindings: 2,
      },
    ])
    expect(result).toEqual({
      prs: 2,
      humanComments: 6,
      findings: 6,
      matchedHuman: 3,
      matchedFindings: 3,
      recall: 0.5,
      precision: 0.5,
      noise: 3,
    })
  })

  it('returns zeros instead of NaN on empty input', () => {
    expect(aggregate([]).recall).toEqual(0)
  })
})

describe(aggregateByStratum.name, () => {
  it('splits by stratum', () => {
    const result = aggregateByStratum([
      {
        pr: 1,
        stratum: 'backend',
        humanComments: 1,
        findings: 1,
        matchedHuman: 1,
        matchedFindings: 1,
      },
      {
        pr: 2,
        stratum: 'config',
        humanComments: 1,
        findings: 0,
        matchedHuman: 0,
        matchedFindings: 0,
      },
    ])
    expect(result.backend?.recall).toEqual(1)
    expect(result.config?.recall).toEqual(0)
    expect(result.frontend).toEqual(undefined)
  })
})

describe(median.name, () => {
  it('handles odd, even and empty', () => {
    expect(median([3, 1, 2])).toEqual(2)
    expect(median([4, 1, 2, 3])).toEqual(2.5)
    expect(median([])).toEqual(undefined)
  })
})
