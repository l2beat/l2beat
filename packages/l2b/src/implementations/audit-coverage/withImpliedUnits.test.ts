import { expect } from 'earl'
import {
  buildAuditedCode,
  sameNameCandidates,
  withImpliedUnits,
} from './AuditedCode'
import type { AuditIndex } from './AuditIndex'
import { coverFlat } from './coverFlat'

const NAMED = 'aaaaaaaaaaaa'
const IMPLIED = 'bbbbbbbbbbbb'

const index: AuditIndex = {
  schema_version: '1.1.0',
  collections: { p: { name: 'P', kind: 'project' } },
  reports: {
    report: {
      collections: ['p'],
      title: 'Report',
      auditor: 'A',
      date: '2024-01-01',
      document: 'p/reports/report.pdf',
    },
  },
  repositories: {
    'o/r': {
      '1111111111111111111111111111111111111111': {
        timestamp: 1_700_000_000,
        files: { 'src/Vault.sol': NAMED },
        audits: { report: { 'src/Vault.sol': [] } },
      },
    },
  },
}

const VAULT = 'contract Vault {\n    uint256 public total;\n}\n'
// One file, two units: the report's named code depends on Math only.
const LIBRARIES =
  'library Math {\n    uint256 constant ONE = 1;\n}\n\nlibrary Unused {\n    uint256 constant TWO = 2;\n}\n'

describe(withImpliedUnits.name, () => {
  const strict = buildAuditedCode(index, new Map([[NAMED, VAULT]]), () => {})
  const relaxed = withImpliedUnits(strict, [
    {
      object: IMPLIED,
      name: 'Math',
      source: LIBRARIES,
      occurrence: {
        repository: 'o/r',
        commit: '1111111111111111111111111111111111111111',
        timestamp: 1_700_000_000,
        path: 'src/Libraries.sol',
        findings: { report: [] },
        directoryScoped: [],
        collections: ['p'],
      },
    },
  ])

  it('adds the implied unit and leaves its file neighbours out', () => {
    expect(sameNameCandidates(relaxed, 'Math').length).toEqual(1)
    expect(sameNameCandidates(relaxed, 'Unused').length).toEqual(0)
    expect(sameNameCandidates(strict, 'Math').length).toEqual(0)
  })

  it('covers a deployed unit only under the relaxed reading', () => {
    const cover = (code: typeof strict) =>
      coverFlat(LIBRARIES, new Map(), code, 'p').map((covered) => ({
        name: covered.unit.name,
        status: covered.unit.status,
        impliedBy: covered.impliedBy,
      }))
    expect(cover(strict)).toEqual([
      { name: 'Math', status: 'none', impliedBy: undefined },
      { name: 'Unused', status: 'none', impliedBy: undefined },
    ])
    expect(cover(relaxed)).toEqual([
      { name: 'Math', status: 'identical', impliedBy: ['report'] },
      { name: 'Unused', status: 'none', impliedBy: undefined },
    ])
  })
})
