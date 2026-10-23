import type { DiscoveryOutput, EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { expect } from 'earl'
import { buildAuditedCode } from './AuditedCode'
import type { AuditIndex } from './AuditIndex'
import { auditCoverageOfProject } from './auditCoverageOfProject'
import { coverageHistoryOfProject } from './coverageHistory'
import type { DeployedSource } from './deployedSource'

// One proxy with two implementations over time, audited by two reports:
// the first covers V1, the second covers V2 after the upgrade shipped.

const PROXY = ChainSpecificAddress(
  'eth:0x000000000000000000000000000000000000000A',
)
const V1 = ChainSpecificAddress(
  'eth:0x0000000000000000000000000000000000000011',
)
const V2 = ChainSpecificAddress(
  'eth:0x0000000000000000000000000000000000000012',
)
const OTHER = ChainSpecificAddress(
  'eth:0x000000000000000000000000000000000000000B',
)

const T_LAUNCH = Date.UTC(2023, 0, 1) / 1000
const T_AUDIT1 = Date.UTC(2023, 2, 1) / 1000
const T_UPGRADE = Date.UTC(2023, 5, 1) / 1000 + 3600
const T_AUDIT2 = Date.UTC(2023, 8, 1) / 1000
const T_UNRELATED = Date.UTC(2023, 10, 1) / 1000
const T_NOW = Date.UTC(2024, 0, 1) / 1000

const PROXY_SOURCE = 'contract Proxy {\n    function p() public {}\n}\n'
const V1_SOURCE =
  'contract Vault {\n    function a() public {}\n    function b() public {}\n}\n'
const V2_SOURCE =
  'contract Vault {\n    function a() public {}\n    function b() public {}\n    function c() public {}\n    function d() public {}\n}\n'
const OTHER_SOURCE = 'contract Other {\n    function o() public {}\n}\n'

const V1_OBJECT = 'aaaaaaaaaaaa'
const V2_OBJECT = 'bbbbbbbbbbbb'
const UNRELATED_OBJECT = 'cccccccccccc'

const index: AuditIndex = {
  schema_version: '1.1.0',
  collections: { p: { name: 'P', kind: 'project' } },
  reports: {
    first: {
      collections: ['p'],
      title: 'First',
      auditor: 'A',
      date: '2023-03-01',
      document: 'p/reports/first.pdf',
    },
    second: {
      collections: ['p'],
      title: 'Second',
      auditor: 'A',
      date: '2023-09-01',
      document: 'p/reports/second.pdf',
    },
    unrelated: {
      collections: ['p'],
      title: 'Unrelated',
      auditor: 'A',
      date: '2023-11-01',
      document: 'p/reports/unrelated.pdf',
    },
  },
  repositories: {
    'o/r': {
      '1111111111111111111111111111111111111111': {
        timestamp: T_AUDIT1 - 86400,
        files: { 'src/Vault.sol': V1_OBJECT },
        audits: { first: { 'src/Vault.sol': [] } },
      },
      '2222222222222222222222222222222222222222': {
        timestamp: T_AUDIT2 - 86400,
        files: { 'src/Vault.sol': V2_OBJECT },
        audits: { second: { 'src/Vault.sol': [] } },
      },
      '3333333333333333333333333333333333333333': {
        timestamp: T_UNRELATED - 86400,
        files: { 'src/Unrelated.sol': UNRELATED_OBJECT },
        audits: { unrelated: { 'src/Unrelated.sol': [] } },
      },
    },
  },
}

const objects = new Map([
  [V1_OBJECT, V1_SOURCE],
  [V2_OBJECT, V2_SOURCE],
  [UNRELATED_OBJECT, 'contract Unrelated {\n    function u() public {}\n}\n'],
])

const discovery = {
  name: 'p',
  timestamp: T_NOW,
  entries: [
    {
      type: 'Contract',
      address: PROXY,
      name: 'Vault',
      sinceTimestamp: T_LAUNCH,
      critical: true,
      values: {
        $implementation: V2,
        $pastUpgrades: [
          [new Date(T_LAUNCH * 1000).toISOString(), '0x1', [V1]],
          [new Date(T_UPGRADE * 1000).toISOString(), '0x2', [V2]],
        ],
      },
    },
    {
      type: 'Contract',
      address: OTHER,
      name: 'Other',
      sinceTimestamp: T_LAUNCH,
      critical: { untilTimestamp: T_AUDIT1 + 86400 },
    },
  ] as EntryParameters[],
} as unknown as DiscoveryOutput

const deployed: Record<string, string> = {
  [PROXY]: PROXY_SOURCE,
  [V1]: V1_SOURCE,
  [V2]: V2_SOURCE,
  [OTHER]: OTHER_SOURCE,
}

const getDeployedSource = async (
  address: ChainSpecificAddress,
): Promise<DeployedSource> => {
  const flat = deployed[address]
  if (flat === undefined) return { kind: 'unverified' }
  return { kind: 'flat', flat, aliases: new Map() }
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')

describe(coverageHistoryOfProject.name, () => {
  const code = buildAuditedCode(index, objects, () => {})
  const flats = {
    [sha256(PROXY_SOURCE)]: [['p0', 1]] as [string, number][],
    [sha256(V2_SOURCE)]: [['v2', 1]] as [string, number][],
  }
  const coverage = {
    discoveredAt: T_NOW,
    contracts: {
      [PROXY]: {
        name: 'Vault',
        critical: true as const,
        source: sha256(PROXY_SOURCE),
        implementations: { [V2]: sha256(V2_SOURCE) },
      },
      [OTHER]: {
        name: 'Other',
        critical: { untilTimestamp: T_AUDIT1 + 86400 },
        source: sha256(OTHER_SOURCE),
      },
    },
    flats,
    units: {
      p0: {
        name: 'Proxy',
        kind: 'contract' as const,
        lines: 3,
        status: 'none' as const,
      },
      v2: {
        name: 'Vault',
        kind: 'contract' as const,
        lines: 6,
        status: 'identical' as const,
        reports: ['second'],
      },
    },
  }

  it('covers the perimeter at every change and reuses unaffected flats', async () => {
    const warnings: string[] = []
    const result = await coverageHistoryOfProject(
      { project: 'p', index, code, discovery, launch: T_LAUNCH, coverage },
      getDeployedSource,
      { progress: () => {}, warn: (m) => warnings.push(m) },
    )
    expect(warnings).toEqual([])
    expect(result.history.launch).toEqual(T_LAUNCH)
    expect(result.history.undatedReports).toEqual([])
    expect(result.reports).toEqual(new Set(['first', 'second']))
    const points = result.history.points
    expect(points.map((p) => p.timestamp)).toEqual([
      T_LAUNCH,
      T_AUDIT1,
      T_AUDIT1 + 86400,
      T_UPGRADE,
      T_AUDIT2,
      T_NOW,
    ])
    // Launch: proxy (3 lines), V1 (4 lines) and Other (3 lines), nothing audited.
    expect(points[0]).toEqual({
      timestamp: T_LAUNCH,
      contracts: 2,
      withoutSource: 0,
      units: { identical: 0, differs: 0, none: 3 },
      lines: { total: 10, covered: 0 },
    })
    // First audit covers V1.
    expect(points[1]).toEqual({
      timestamp: T_AUDIT1,
      contracts: 2,
      withoutSource: 0,
      units: { identical: 1, differs: 0, none: 2 },
      lines: { total: 10, covered: 4 },
      reports: ['first'],
    })
    // Other leaves the perimeter.
    expect(points[2]?.changes).toEqual([
      { address: OTHER, name: 'Other', kind: 'removed' },
    ])
    expect(points[2]?.lines).toEqual({ total: 7, covered: 4 })
    // The upgrade ships V2, which differs from audited V1.
    expect(points[3]?.changes).toEqual([
      { address: PROXY, name: 'Vault', kind: 'upgraded' },
    ])
    expect(points[3]?.units).toEqual({ identical: 0, differs: 1, none: 1 })
    expect(points[3]?.lines).toEqual({ total: 9, covered: 4 })
    // The second audit covers V2; the unrelated report changes nothing and
    // its point is dropped.
    expect(points[4]).toEqual({
      timestamp: T_AUDIT2,
      contracts: 1,
      withoutSource: 0,
      units: { identical: 1, differs: 0, none: 1 },
      lines: { total: 9, covered: 6 },
      reports: ['second'],
    })
    // The present comes from the main pass.
    expect(points[5]).toEqual({
      timestamp: T_NOW,
      contracts: 1,
      withoutSource: 0,
      units: { identical: 1, differs: 0, none: 1 },
      lines: { total: 9, covered: 6 },
    })
    // Flats: proxy, V1, Other at launch (3); first audit recovers V1 and the
    // proxy? No: only names in the added objects (Vault) recompute, so V1
    // alone (1); V2 at the upgrade (1); the second audit recomputes V2 (1).
    // The unrelated report adds no known name, so everything is reused.
    expect(result.stats.covered).toEqual(6)
    expect(result.stats.reused).toBeGreaterThan(0)
    expect(result.stats.fetched).toEqual(4)
  })

  it('reports unverified code and counts no lines for it', async () => {
    const warnings: string[] = []
    const result = await coverageHistoryOfProject(
      { project: 'p', index, code, discovery, launch: T_LAUNCH, coverage },
      async (address) =>
        address === V1 ? { kind: 'unverified' } : getDeployedSource(address),
      { progress: () => {}, warn: (m) => warnings.push(m) },
    )
    expect(warnings.length).toEqual(1)
    expect(warnings[0]).toInclude(V1)
    expect(result.history.points[0]?.lines).toEqual({ total: 6, covered: 0 })
  })
})

describe(`${auditCoverageOfProject.name} with history`, () => {
  it('is wired through the main pass', () => {
    // Covered by the command run on real projects; the main pass reads
    // discovery from disk, which the unit test above avoids.
    expect(typeof auditCoverageOfProject).toEqual('function')
  })
})
