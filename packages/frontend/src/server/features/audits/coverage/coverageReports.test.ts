import type { ProjectAuditCoverage } from '@l2beat/config'
import { expect } from 'earl'
import {
  auditedFileUrl,
  matchedReportIds,
  primaryReportId,
  reportOrigin,
  reportUrl,
  stackCollectionOf,
  unitOrigin,
} from './coverageReports'

const FLAT = 'a'.repeat(64)

const coverage: ProjectAuditCoverage = {
  schema_version: '1.0.0',
  project: 'unichain',
  dataset: { repository: 'o/audit-dataset', commit: 'c'.repeat(40) },
  discoveredAt: 1,
  collections: {
    unichain: { name: 'Unichain', kind: 'project' },
    optimism: { name: 'OP Mainnet', kind: 'project' },
    arbitrum: { name: 'Arbitrum One', kind: 'project' },
    '_libs/openzeppelin': { name: 'OpenZeppelin', kind: 'library' },
  },
  reports: {
    own: {
      collections: ['unichain'],
      title: 'Own',
      auditor: 'A',
      date: '2024-01-01',
      document: 'unichain/reports/Own (final).pdf',
    },
    'op-old': {
      collections: ['optimism'],
      title: 'OP old',
      auditor: 'B',
      date: '2023-01-01',
      document: 'optimism/reports/old.pdf',
    },
    'op-new': {
      collections: ['optimism'],
      title: 'OP new',
      auditor: 'B',
      date: '2024-06-01',
      document: 'optimism/reports/new.pdf',
    },
    oz: {
      collections: ['_libs/openzeppelin'],
      title: 'OZ',
      auditor: 'C',
      document: '_libs/openzeppelin/reports/oz.pdf',
    },
    arb: {
      collections: ['arbitrum'],
      title: 'Arb',
      auditor: 'D',
      date: '2024-02-01',
      document: 'arbitrum/reports/arb.pdf',
    },
  },
  auditedFiles: {},
  units: {
    u1: {
      name: 'Bridge',
      kind: 'contract',
      lines: 10,
      status: 'identical',
      reports: ['oz', 'op-old', 'op-new'],
    },
    u2: {
      name: 'IERC20',
      kind: 'interface',
      lines: 5,
      status: 'identical',
      reports: ['arb', 'oz'],
    },
  },
  flats: { [FLAT]: [['u1', 1], ['u2', 20]] },
  contracts: { 'eth:0x1': { name: 'Bridge', source: FLAT } },
}

describe('coverageReports', () => {
  describe(stackCollectionOf.name, () => {
    it('maps a known stack to its collection when the coverage knows it', () => {
      expect(stackCollectionOf(['OP Stack'], coverage)).toEqual('optimism')
      expect(stackCollectionOf(['ZK Stack'], coverage)).toEqual(undefined)
      expect(stackCollectionOf(['StarkEx'], coverage)).toEqual(undefined)
      expect(stackCollectionOf(undefined, coverage)).toEqual(undefined)
    })
  })

  describe(reportOrigin.name, () => {
    it('classifies own, stack, library and other', () => {
      expect(reportOrigin('own', coverage, 'unichain', 'optimism')).toEqual(
        'own',
      )
      expect(reportOrigin('op-new', coverage, 'unichain', 'optimism')).toEqual(
        'stack',
      )
      expect(reportOrigin('op-new', coverage, 'unichain', undefined)).toEqual(
        'other',
      )
      expect(reportOrigin('oz', coverage, 'unichain', 'optimism')).toEqual(
        'library',
      )
      expect(reportOrigin('arb', coverage, 'unichain', 'optimism')).toEqual(
        'other',
      )
    })
  })

  describe(reportUrl.name, () => {
    it('links the document at the dataset commit, segments encoded', () => {
      expect(reportUrl(coverage, 'own')).toEqual(
        `https://github.com/o/audit-dataset/blob/${'c'.repeat(40)}/unichain/reports/Own%20(final).pdf`,
      )
    })
  })

  describe(auditedFileUrl.name, () => {
    it('links GitHub repositories, gists and other hosts', () => {
      expect(
        auditedFileUrl({
          repository: 'ethereum-optimism/optimism',
          commit: 'abc',
          path: 'src/A.sol',
          blob: 'b',
        }),
      ).toEqual('https://github.com/ethereum-optimism/optimism/blob/abc/src/A.sol')
      expect(
        auditedFileUrl({
          repository: 'gist/owner/123',
          commit: 'abc',
          path: 'A.sol',
          blob: 'b',
        }),
      ).toEqual('https://gist.github.com/owner/123')
      expect(
        auditedFileUrl({
          repository: 'gitlab.com/owner/repo',
          commit: 'abc',
          path: 'A.sol',
          blob: 'b',
        }),
      ).toEqual('https://gitlab.com/owner/repo/blob/abc/A.sol')
    })
  })

  describe(matchedReportIds.name, () => {
    it('collects the reports of the units of the given flats', () => {
      expect([...matchedReportIds(coverage, [FLAT])].sort()).toEqual([
        'arb',
        'op-new',
        'op-old',
        'oz',
      ])
      expect(matchedReportIds(coverage, ['missing']).size).toEqual(0)
    })
  })

  describe(unitOrigin.name, () => {
    it('takes the closest origin among the reports', () => {
      const u1 = coverage.units.u1
      const u2 = coverage.units.u2
      if (!u1 || !u2) throw new Error('fixture')
      expect(unitOrigin(u1, coverage, 'unichain', 'optimism')).toEqual('stack')
      expect(unitOrigin(u1, coverage, 'unichain', undefined)).toEqual('library')
      expect(unitOrigin(u2, coverage, 'unichain', 'optimism')).toEqual('library')
    })
  })

  describe(primaryReportId.name, () => {
    it('prefers the closest origin, then the newest report', () => {
      const u1 = coverage.units.u1
      if (!u1) throw new Error('fixture')
      expect(primaryReportId(u1, coverage, 'unichain', 'optimism')).toEqual(
        'op-new',
      )
      expect(primaryReportId(u1, coverage, 'unichain', undefined)).toEqual('oz')
      expect(
        primaryReportId(
          { name: 'X', kind: 'contract', lines: 1, status: 'none' },
          coverage,
          'unichain',
          undefined,
        ),
      ).toEqual(undefined)
    })
  })
})
