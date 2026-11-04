import type { ProjectAuditCoverage } from '@l2beat/config'
import { expect } from 'earl'
import { getAuditsCoverageHistory } from './getAuditsCoverageHistory'

describe(getAuditsCoverageHistory.name, () => {
  const coverage = {
    dataset: { repository: 'o/d', commit: 'c' },
    collections: {
      own: { name: 'Own', kind: 'project' },
      optimism: { name: 'OP Mainnet', kind: 'project' },
    },
    reports: {
      a: {
        collections: ['own'],
        title: 'A',
        auditor: 'X',
        date: '2024-01-01',
        document: 'own/reports/a.pdf',
      },
      b: {
        collections: ['optimism'],
        title: 'B',
        auditor: 'Y',
        document: 'optimism/reports/b.pdf',
      },
    },
    history: {
      launch: 100,
      points: [
        {
          timestamp: 100,
          contracts: 2,
          withoutSource: 1,
          units: { identical: 0, differs: 0, none: 3 },
          lines: { total: 0, covered: 0 },
        },
        {
          timestamp: 200,
          contracts: 2,
          withoutSource: 0,
          units: { identical: 1, differs: 1, none: 1 },
          lines: { total: 40, covered: 10 },
          reports: ['a'],
          changes: [{ address: 'eth:0x1', name: 'C', kind: 'upgraded' }],
        },
      ],
      undatedReports: ['b'],
    },
  } as unknown as ProjectAuditCoverage

  it('derives percentages, report refs and statuses', () => {
    const history = getAuditsCoverageHistory(coverage, 'own', 'optimism')
    expect(history?.launch).toEqual(100)
    expect(history?.points.map((p) => p.percent)).toEqual([0, 25])
    expect(history?.points.map((p) => p.lines.uncovered)).toEqual([0, 30])
    expect(history?.points[0]?.reports).toEqual([])
    expect(history?.points[0]?.changes).toEqual([])
    expect(history?.points[1]?.units).toEqual({
      identical: 1,
      differs: 1,
      unaudited: 1,
    })
    expect(history?.points[1]?.reports.map((r) => [r.id, r.origin])).toEqual([
      ['a', 'own'],
    ])
    expect(history?.points[1]?.changes).toEqual([
      { address: 'eth:0x1', name: 'C', kind: 'upgraded' },
    ])
    expect(history?.undatedReports.map((r) => [r.id, r.origin])).toEqual([
      ['b', 'stack'],
    ])
  })

  it('is undefined without a generated history', () => {
    expect(
      getAuditsCoverageHistory(
        { ...coverage, history: undefined },
        'own',
        undefined,
      ),
    ).toEqual(undefined)
  })
})
