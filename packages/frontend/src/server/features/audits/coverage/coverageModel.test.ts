import type { ProjectAuditCoverage } from '@l2beat/config'
import { expect } from 'earl'
import {
  contractSources,
  isFlatHash,
  selectContracts,
  summarizeUnits,
  unitCoveredLines,
  unitStatus,
} from './coverageModel'

type Contract = ProjectAuditCoverage['contracts'][string]
type Unit = ProjectAuditCoverage['units'][string]

const FLAT_A = 'a'.repeat(64)
const FLAT_B = 'b'.repeat(64)

function coverage(
  partial: Partial<ProjectAuditCoverage> = {},
): ProjectAuditCoverage {
  return {
    schema_version: '1.0.0',
    project: 'p',
    dataset: { repository: 'o/audit-dataset', commit: 'c'.repeat(40) },
    discoveredAt: 1,
    collections: {
      p: { name: 'P', kind: 'project' },
      optimism: { name: 'OP Mainnet', kind: 'project' },
      '_libs/openzeppelin': { name: 'OpenZeppelin', kind: 'library' },
    },
    reports: {
      own: {
        collections: ['p'],
        title: 'Own',
        auditor: 'A',
        document: 'p/reports/own.pdf',
      },
      op: {
        collections: ['optimism'],
        title: 'OP',
        auditor: 'B',
        document: 'optimism/reports/op.pdf',
      },
      oz: {
        collections: ['_libs/openzeppelin'],
        title: 'OZ',
        auditor: 'C',
        document: '_libs/openzeppelin/reports/oz.pdf',
      },
    },
    auditedFiles: {},
    units: {},
    flats: {},
    contracts: {},
    ...partial,
  }
}

function unit(partial: Partial<Unit>): Unit {
  return { name: 'U', kind: 'contract', lines: 10, status: 'none', ...partial }
}

describe('coverageModel', () => {
  describe(selectContracts.name, () => {
    const contracts: Record<string, Contract> = {
      'eth:0x1': { name: 'A', source: FLAT_A, critical: true },
      'eth:0x2': { name: 'B', source: FLAT_B },
      'eth:0x3': {
        name: 'C',
        source: FLAT_B,
        critical: { sinceTimestamp: 1, untilTimestamp: 2 },
      },
      'eth:0x4': { name: 'D', source: FLAT_B, critical: { sinceTimestamp: 1 } },
    }

    it('shows the current critical perimeter when one exists', () => {
      expect(selectContracts(coverage({ contracts }))).toEqual({
        selection: 'critical',
        addresses: ['eth:0x1', 'eth:0x4'],
      })
    })

    it('shows every contract without critical ones', () => {
      const all = coverage({
        contracts: { 'eth:0x2': contracts['eth:0x2'] as Contract },
      })
      expect(selectContracts(all)).toEqual({
        selection: 'all',
        addresses: ['eth:0x2'],
      })
    })

    it('shows every contract when every critical window has ended', () => {
      const expired = coverage({
        contracts: {
          'eth:0x2': contracts['eth:0x2'] as Contract,
          'eth:0x3': contracts['eth:0x3'] as Contract,
        },
      })
      expect(selectContracts(expired).selection).toEqual('all')
    })
  })

  describe(unitStatus.name, () => {
    const c = coverage()

    it('maps none and differs', () => {
      expect(unitStatus(unit({ status: 'none' }), c, 'p')).toEqual('unaudited')
      expect(unitStatus(unit({ status: 'differs', reports: ['oz'] }), c, 'p'))
        .toEqual('differs')
    })

    it('shows identical library-only matches as library', () => {
      expect(
        unitStatus(unit({ status: 'identical', reports: ['oz'] }), c, 'p'),
      ).toEqual('library')
    })

    it('shows identical matches with a project report as identical', () => {
      expect(
        unitStatus(unit({ status: 'identical', reports: ['oz', 'op'] }), c, 'p'),
      ).toEqual('identical')
      expect(
        unitStatus(unit({ status: 'identical', reports: ['own'] }), c, 'p'),
      ).toEqual('identical')
    })
  })

  describe(unitCoveredLines.name, () => {
    it('counts every line of identical units and the covered lines of differing ones', () => {
      expect(unitCoveredLines(unit({ lines: 10 }), 'identical')).toEqual(10)
      expect(unitCoveredLines(unit({ lines: 10 }), 'library')).toEqual(10)
      expect(
        unitCoveredLines(unit({ lines: 10, covered: 7 }), 'differs'),
      ).toEqual(7)
      expect(unitCoveredLines(unit({ lines: 10 }), 'unaudited')).toEqual(0)
    })
  })

  describe(contractSources.name, () => {
    it('lists the proxy first, then the implementations, with their flats', () => {
      const contract: Contract = {
        name: 'Proxy',
        source: FLAT_A,
        implementations: { 'eth:0x9': FLAT_B, 'eth:0x8': 'unverified' },
      }
      expect(contractSources('eth:0x1', contract)).toEqual([
        { address: 'eth:0x1', role: 'proxy', flat: FLAT_A },
        { address: 'eth:0x9', role: 'implementation', flat: FLAT_B },
        { address: 'eth:0x8', role: 'implementation', flat: undefined },
      ])
    })

    it('treats a single source as the implementation', () => {
      expect(
        contractSources('eth:0x1', { name: 'A', source: 'non-solidity' }),
      ).toEqual([{ address: 'eth:0x1', role: 'implementation', flat: undefined }])
    })

    it('recognizes flat hashes', () => {
      expect(isFlatHash(FLAT_A)).toEqual(true)
      expect(isFlatHash('unverified')).toEqual(false)
    })
  })

  describe(summarizeUnits.name, () => {
    it('counts instances, unique units and lines', () => {
      const summary = summarizeUnits([
        { unitId: 'x', status: 'identical', lines: 10, coveredLines: 10 },
        { unitId: 'x', status: 'identical', lines: 10, coveredLines: 10 },
        { unitId: 'y', status: 'differs', lines: 20, coveredLines: 15 },
        { unitId: 'z', status: 'unaudited', lines: 5, coveredLines: 0 },
      ])
      expect(summary).toEqual({
        units: { identical: 2, library: 0, differs: 1, unaudited: 1 },
        uniqueUnits: { identical: 1, library: 0, differs: 1, unaudited: 1 },
        lines: { total: 45, covered: 35, uncovered: 10 },
      })
    })
  })
})
