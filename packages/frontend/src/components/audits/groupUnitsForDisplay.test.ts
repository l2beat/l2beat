import { expect } from 'earl'
import type {
  AuditsUnitEntry,
  AuditsUnitMatchEntry,
  AuditUnitStatus,
} from '~/server/features/audits/types'
import { groupUnitsForDisplay } from './groupUnitsForDisplay'

const report = {
  id: 'r1',
  title: 'Report',
  auditor: 'Auditor',
  url: 'https://example.com/report',
  origin: 'own' as const,
  collectionName: 'project',
}

function match(findingIds: string[] = []): AuditsUnitMatchEntry {
  return {
    origin: 'own',
    collectionName: 'project',
    report,
    reports: [report],
    repository: 'org/repo',
    path: 'src/A.sol',
    commit: 'abcdef1234',
    url: 'https://example.com/src/A.sol',
    findings: findingIds.length > 0 ? [{ report, ids: findingIds }] : [],
    findingIds,
  }
}

function unit(
  name: string,
  status: AuditUnitStatus,
  findingIds: string[] = [],
): AuditsUnitEntry {
  return {
    id: `flat:${name}`,
    flat: 'flat',
    unitId: name,
    name,
    kind: 'contract',
    startLine: 1,
    endLine: 10,
    lines: 10,
    status,
    coveredLines: status === 'unaudited' ? 0 : 10,
    match: status === 'unaudited' ? undefined : match(findingIds),
  }
}

describe(groupUnitsForDisplay.name, () => {
  it('orders rows: unaudited, differs, then identical with major findings', () => {
    const units = [
      unit('A', 'identical'),
      unit('B', 'differs'),
      unit('C', 'unaudited'),
      unit('D', 'identical', ['M-1']),
      unit('E', 'library'),
      unit('F', 'unaudited'),
      unit('G', 'differs'),
    ]
    const { rows, audited } = groupUnitsForDisplay(units)
    expect(rows.map((u) => u.name)).toEqual(['C', 'F', 'B', 'G', 'D'])
    expect(audited.map((u) => u.name)).toEqual(['A', 'E'])
  })

  it('keeps the flat file order within each group', () => {
    const units = [
      unit('Z', 'unaudited'),
      unit('Y', 'unaudited'),
      unit('X', 'identical'),
      unit('W', 'identical'),
    ]
    const { rows, audited } = groupUnitsForDisplay(units)
    expect(rows.map((u) => u.name)).toEqual(['Z', 'Y'])
    expect(audited.map((u) => u.name)).toEqual(['X', 'W'])
  })

  it('returns empty groups for no units', () => {
    expect(groupUnitsForDisplay([])).toEqual({ rows: [], audited: [] })
  })
})
