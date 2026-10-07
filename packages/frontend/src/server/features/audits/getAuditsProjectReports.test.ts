import type { CollectionRef, ProjectAuditCoverage } from '@l2beat/audit-diff'
import { expect, mockObject } from 'earl'
import type { AuditCoverageSource } from './AuditCoverageSource'
import {
  getAuditsProjectReports,
  parseReportDate,
} from './getAuditsProjectReports'

describe(getAuditsProjectReports.name, () => {
  const report = {
    reportIds: [
      'own/matched',
      'optimism/matched',
      'openzeppelin/matched',
      'lib/other',
      'kailua/matched',
    ],
    context: {
      key: 'k',
      collections: [
        { id: 'own', rank: 0, origin: 'own', relation: { type: 'own' } },
        {
          id: 'optimism',
          rank: 2,
          origin: 'stack',
          relation: { type: 'template', template: 'opstack/L1StandardBridge' },
        },
        {
          id: 'openzeppelin',
          rank: 2,
          origin: 'stack',
          relation: { type: 'template', template: 'global/ProxyAdmin' },
        },
        {
          id: 'lib',
          rank: 3,
          origin: 'library',
          relation: { type: 'library' },
        },
      ],
    },
  } as unknown as ProjectAuditCoverage

  const collections: Record<string, CollectionRef> = {
    own: { id: 'own', name: 'Own', kind: 'project' },
    optimism: { id: 'optimism', name: 'Optimism', kind: 'project' },
    openzeppelin: { id: 'openzeppelin', name: 'OpenZeppelin', kind: 'library' },
    lib: { id: 'lib', name: 'Lib', kind: 'library' },
    kailua: { id: 'kailua', name: 'Kailua', kind: 'project' },
  }

  const source = mockObject<AuditCoverageSource>({
    listReports: () => [
      ref('own/matched', 'own', '2024-03-01'),
      ref('own/unmatched', 'own', '2022-01-15'),
      ref('own/undated', 'own', null),
      ref('optimism/matched', 'optimism', '2023-06-01'),
      ref('optimism/unmatched', 'optimism', '2023-09-01'),
      ref('openzeppelin/matched', 'openzeppelin', '2023-10-03'),
      ref('lib/other', 'lib', '2023-06-01'),
      ref('kailua/matched', 'kailua', '2025-02-18'),
    ],
    getCollection: (id) => collections[id],
  })

  it('returns the dated own reports and the matched stack project reports ascending', () => {
    const result = getAuditsProjectReports(report, source)
    expect(result.map((r) => [r.id, r.origin, r.matched])).toEqual([
      ['own/unmatched', 'own', false],
      ['optimism/matched', 'stack', true],
      ['own/matched', 'own', true],
    ])
    expect(result[0]?.timestamp).toEqual(parseReportDate('2022-01-15'))
    expect(result[1]?.collectionName).toEqual('Optimism')
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

  it('falls back to the month or day the id ends with', () => {
    expect(parseReportDate(null, 'umbra/consensys-umbra-2021-03')).toEqual(
      parseReportDate('2021-03-01'),
    )
    expect(parseReportDate(null, 'own/abdk-audit-2019-11-19')).toEqual(
      parseReportDate('2019-11-19'),
    )
    expect(parseReportDate(null, 'own/certora-safe-1-3-0')).toEqual(undefined)
    expect(parseReportDate('2024-03-01', 'own/x-2020-01')).toEqual(
      parseReportDate('2024-03-01'),
    )
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
