import type { ProjectAuditCoverage } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getAuditsProjectReports,
  parseReportDate,
} from './getAuditsProjectReports'

describe(getAuditsProjectReports.name, () => {
  const coverage = {
    dataset: { repository: 'o/d', commit: 'c' },
    collections: {
      own: { name: 'Own', kind: 'project' },
      optimism: { name: 'OP Mainnet', kind: 'project' },
      '_libs/openzeppelin': { name: 'OpenZeppelin', kind: 'library' },
      kailua: { name: 'Kailua', kind: 'project' },
    },
    reports: {
      'own/matched': report(['own'], '2024-03-01'),
      'own/unmatched': report(['own'], '2022-01-15'),
      'own/undated': report(['own'], null),
      'own/dated-by-id-2021-03': report(['own'], null),
      'optimism/matched': report(['optimism'], '2023-06-01'),
      'optimism/unmatched': report(['optimism'], '2023-09-01'),
      'openzeppelin/matched': report(['_libs/openzeppelin'], '2023-10-03'),
      'kailua/matched': report(['kailua'], '2024-01-01'),
    },
  } as unknown as ProjectAuditCoverage

  const matched = new Set([
    'own/matched',
    'optimism/matched',
    'openzeppelin/matched',
    'kailua/matched',
  ])

  it('lists dated own reports and matched stack reports, ascending', () => {
    const audits = getAuditsProjectReports(coverage, 'own', 'optimism', matched)
    expect(audits.map((a) => [a.id, a.origin, a.matched])).toEqual([
      ['own/dated-by-id-2021-03', 'own', false],
      ['own/unmatched', 'own', false],
      ['optimism/matched', 'stack', true],
      ['own/matched', 'own', true],
    ])
    expect(audits[2]?.collectionName).toEqual('OP Mainnet')
    expect(audits[2]?.url).toEqual(
      'https://github.com/o/d/blob/c/optimism/reports/x.pdf',
    )
  })

  it('counts no stack audits without a stack collection', () => {
    const audits = getAuditsProjectReports(coverage, 'own', undefined, matched)
    expect(audits.map((a) => a.origin)).toEqual(['own', 'own', 'own'])
  })
})

describe(parseReportDate.name, () => {
  it('parses ISO days and falls back to the id suffix', () => {
    expect(parseReportDate('2024-03-01')).toEqual(UnixTime(1709251200))
    expect(parseReportDate(null, 'consensys-umbra-2021-03')).toEqual(
      UnixTime(1614556800),
    )
    expect(parseReportDate(null, 'no-date-here')).toEqual(undefined)
  })
})

function report(collections: string[], date: string | null) {
  return {
    collections,
    title: 'T',
    auditor: 'A',
    ...(date === null ? {} : { date }),
    document: `${collections[0]}/reports/x.pdf`,
  }
}
