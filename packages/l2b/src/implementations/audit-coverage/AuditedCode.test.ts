import { expect } from 'earl'
import {
  auditedCodeAt,
  buildAuditedCode,
  firstCountedAt,
  reportDates,
  sameNameCandidates,
} from './AuditedCode'
import type { AuditIndex } from './AuditIndex'

const OLD = 'aaaaaaaaaaaa'
const NEW = 'bbbbbbbbbbbb'
const SHARED = 'cccccccccccc'

const index: AuditIndex = {
  schema_version: '1.1.0',
  collections: {
    p: { name: 'P', kind: 'project' },
    '_libs/oz': { name: 'OZ', kind: 'library' },
  },
  reports: {
    early: {
      collections: ['p'],
      title: 'Early',
      auditor: 'A',
      date: '2023-01-01',
      document: 'p/reports/early.pdf',
    },
    late: {
      collections: ['_libs/oz'],
      title: 'Late',
      auditor: 'A',
      date: '2024-01-01',
      document: '_libs/oz/reports/late.pdf',
    },
    undated: {
      collections: ['p'],
      title: 'Undated',
      auditor: 'A',
      date: null,
      document: 'p/reports/undated.pdf',
    },
  },
  repositories: {
    'o/r': {
      '1111111111111111111111111111111111111111': {
        timestamp: 1_600_000_000,
        files: { 'src/Old.sol': OLD, 'src/Shared.sol': SHARED },
        audits: { early: { 'src/Old.sol': [], 'src/Shared.sol': [] } },
      },
      '2222222222222222222222222222222222222222': {
        timestamp: 1_700_000_000,
        files: { 'src/New.sol': NEW, 'src/Shared.sol': SHARED },
        audits: {
          late: { src: [] },
          undated: { 'src/New.sol': ['F-1'] },
        },
      },
    },
  },
}

const objects = new Map([
  [OLD, 'contract Old {\n    function f() public {}\n}\n'],
  [NEW, 'contract New {\n    function g() public {}\n}\n'],
  [SHARED, 'library Shared {\n    function s() internal {}\n}\n'],
])

const code = buildAuditedCode(index, objects, () => {})
const dates = reportDates(index)

describe(reportDates.name, () => {
  it('dates reports, leaving undated ones out', () => {
    expect([...dates.keys()]).toEqual(['early', 'late'])
  })
})

describe(firstCountedAt.name, () => {
  it('finds when each object was first audited by a dated report', () => {
    const first = firstCountedAt(code, dates)
    expect(first.get(OLD)).toEqual(dates.get('early'))
    expect(first.get(SHARED)).toEqual(dates.get('early'))
    expect(first.get(NEW)).toEqual(dates.get('late'))
  })
})

describe(auditedCodeAt.name, () => {
  it('knows only the reports dated by the cutoff', () => {
    const at = auditedCodeAt(code, index, dates, dates.get('early') as number)
    expect(sameNameCandidates(at, 'Old').length).toEqual(1)
    expect(sameNameCandidates(at, 'Shared').length).toEqual(1)
    expect(sameNameCandidates(at, 'New').length).toEqual(0)
    expect(at.occurrences.get(NEW)).toEqual(undefined)
    expect(at.occurrences.get(SHARED)?.length).toEqual(1)
    expect(at.occurrences.get(SHARED)?.[0]?.collections).toEqual(['p'])
  })

  it('drops undated reports at every cutoff and recomputes collections', () => {
    const at = auditedCodeAt(code, index, dates, dates.get('late') as number)
    expect(sameNameCandidates(at, 'New').length).toEqual(1)
    const occurrences = at.occurrences.get(NEW) ?? []
    expect(Object.keys(occurrences[0]?.findings ?? {})).toEqual(['late'])
    expect(occurrences[0]?.directoryScoped).toEqual(['late'])
    expect(occurrences[0]?.collections).toEqual(['_libs/oz'])
  })

  it('knows nothing before the first report', () => {
    const at = auditedCodeAt(code, index, dates, 0)
    expect(at.declarations.length).toEqual(0)
    expect(at.occurrences.size).toEqual(0)
    expect(at.declarationsByObject).toEqual(code.declarationsByObject)
  })
})
