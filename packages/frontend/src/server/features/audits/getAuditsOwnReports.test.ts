import type { ProjectAuditCoverage } from '@l2beat/audit-diff'
import { expect, mockObject } from 'earl'
import type { AuditCoverageSource } from './AuditCoverageSource'
import { getAuditsOwnReports, parseReportDate } from './getAuditsOwnReports'

describe(getAuditsOwnReports.name, () => {
  const report = {
    reportIds: ['own/matched', 'lib/other'],
    context: {
      key: 'k',
      collections: [
        { id: 'own', rank: 0, origin: 'own', relation: { type: 'own' } },
        {
          id: 'lib',
          rank: 3,
          origin: 'library',
          relation: { type: 'library' },
        },
      ],
    },
  } as unknown as ProjectAuditCoverage

  const source = mockObject<AuditCoverageSource>({
    listReports: () => [
      ref('own/matched', 'own', '2024-03-01'),
      ref('own/unmatched', 'own', '2022-01-15'),
      ref('own/undated', 'own', null),
      ref('lib/other', 'lib', '2023-06-01'),
    ],
  })

  it('returns the dated own reports ascending, flagging matches', () => {
    const result = getAuditsOwnReports(report, source)
    expect(result.map((r) => [r.id, r.matched])).toEqual([
      ['own/unmatched', false],
      ['own/matched', true],
    ])
    expect(result[0]?.timestamp).toEqual(parseReportDate('2022-01-15'))
  })
})

describe(parseReportDate.name, () => {
  it('parses ISO days to unix seconds', () => {
    expect(parseReportDate('2024-03-01')).toEqual(1709251200)
  })

  it('treats null and garbage as undated', () => {
    expect(parseReportDate(null)).toEqual(undefined)
    expect(parseReportDate('soon')).toEqual(undefined)
  })
})

function ref(id: string, collection: string, reportDate: string | null) {
  return {
    id,
    collection,
    title: id,
    auditor: 'A',
    reportDate,
    reportFile: `${id}.md`,
  }
}
