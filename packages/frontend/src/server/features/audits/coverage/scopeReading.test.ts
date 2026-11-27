import type { ProjectAuditCoverage, ProjectAuditScope } from '@l2beat/config'
import { expect } from 'earl'
import { coverageUnderReading } from './scopeReading'

type Unit = ProjectAuditCoverage['units'][string]

const unaudited: Unit = {
  name: 'Math',
  kind: 'library',
  lines: 10,
  status: 'none',
}
const implied: Unit = {
  name: 'Math',
  kind: 'library',
  lines: 10,
  status: 'identical',
  audited: { object: 'bbbbbbbbbbbb', lines: [1, 10] },
  reports: ['report'],
}

const coverage: ProjectAuditCoverage = {
  schema_version: '1.0.0',
  project: 'p',
  dataset: { repository: 'o/audit-dataset', commit: 'c'.repeat(40) },
  discoveredAt: 1,
  collections: {},
  reports: {},
  auditedFiles: {},
  // The base result, from before the scope existed.
  units: { math: implied, other: unaudited },
  flats: {},
  contracts: {},
}

const scope: ProjectAuditScope = {
  schema_version: '0.1.0',
  project: 'p',
  dataset: coverage.dataset,
  reports: {},
  reportInfo: {
    report: {
      collections: ['p'],
      title: 'Report',
      auditor: 'A',
      document: 'p/reports/report.pdf',
    },
  },
  collections: { p: { name: 'P', kind: 'project' } },
  auditedFiles: {
    bbbbbbbbbbbb: {
      repository: 'o/r',
      commit: '1'.repeat(40),
      path: 'src/Math.sol',
      blob: '2'.repeat(40),
      upstream: true,
    },
  },
  units: {
    math: { strict: unaudited, relaxed: { ...implied, impliedBy: ['report'] } },
  },
}

describe(coverageUnderReading.name, () => {
  it('shows implied code as unaudited under the strict reading', () => {
    const read = coverageUnderReading(coverage, scope, 'strict')
    expect(read.coverage.units.math).toEqual(unaudited)
    expect(read.impliedBy.size).toEqual(0)
  })

  it('counts implied code and says which reports imply it when relaxed', () => {
    const read = coverageUnderReading(coverage, scope, 'relaxed')
    expect(read.coverage.units.math).toEqual(implied)
    expect(read.impliedBy.get('math')).toEqual(['report'])
    expect(read.upstream.has('bbbbbbbbbbbb')).toEqual(true)
    expect(read.coverage.reports.report?.title).toEqual('Report')
  })

  it('keeps the base result of units the scope does not know', () => {
    const read = coverageUnderReading(coverage, scope, 'strict')
    expect(read.coverage.units.other).toEqual(unaudited)
  })
})
