import {
  ConfigReader,
  type DiscoveryOutput,
  get$Implementations,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  AuditCoverage,
  AuditedFile,
  CoverageReport,
  Unit,
} from './AuditCoverage'
import type { AuditedCode } from './AuditedCode'
import type { AuditIndex } from './AuditIndex'
import { type CoveredUnit, coverFlat } from './coverFlat'
import type { GetDeployedSource } from './deployedSource'

export interface AuditCoverageInputs {
  index: AuditIndex
  code: AuditedCode
  datasetCommit: string
  generatedAt: number
}

export async function auditCoverageOfProject(
  project: string,
  inputs: AuditCoverageInputs,
  getDeployedSource: GetDeployedSource,
  onProgress: (
    address: ChainSpecificAddress,
    index: number,
    count: number,
  ) => void,
): Promise<AuditCoverage> {
  const discovery = new ConfigReader(getDiscoveryPaths().discovery)
  const discovered = discovery.readDiscovery(project)
  const units: Record<string, Unit> = {}
  const flats: Record<string, [string, number][]> = {}
  const contracts: Record<string, string> = {}
  const auditedFiles = new Map<string, AuditedFile>()
  const addresses = codeAddresses(discovered)
  for (const [i, address] of addresses.entries()) {
    onProgress(address, i, addresses.length)
    const source = await getDeployedSource(address)
    if (source.kind !== 'flat') {
      contracts[address] = source.kind
      continue
    }
    const flatSha256 = createHash('sha256').update(source.flat).digest('hex')
    contracts[address] = flatSha256
    if (flats[flatSha256] !== undefined) {
      continue
    }
    flats[flatSha256] = coverFlat(
      source.flat,
      source.aliases,
      inputs.code,
      project,
    ).map((covered) => {
      addUnit(units, covered)
      addAuditedFile(auditedFiles, covered)
      return [covered.id, covered.first]
    })
  }
  return {
    schema_version: '1.0.0',
    project,
    datasetCommit: inputs.datasetCommit,
    discoveredAt: discovered.timestamp,
    generatedAt: inputs.generatedAt,
    reports: usedReports(units, inputs.index),
    auditedFiles: Object.fromEntries(
      [...auditedFiles].sort(([a], [b]) => (a < b ? -1 : 1)),
    ),
    units,
    flats,
    contracts,
  }
}

function codeAddresses(discovered: DiscoveryOutput): ChainSpecificAddress[] {
  const addresses = new Set<ChainSpecificAddress>()
  for (const entry of discovered.entries) {
    if (entry.type !== 'Contract') {
      continue
    }
    addresses.add(entry.address)
    for (const implementation of get$Implementations(entry.values)) {
      addresses.add(implementation)
    }
  }
  return [...addresses]
}

function addUnit(units: Record<string, Unit>, covered: CoveredUnit) {
  const existing = units[covered.id]
  if (existing !== undefined) {
    assert(
      JSON.stringify(existing) === JSON.stringify(covered.unit),
      `Unit ${covered.id} matched differently twice`,
    )
    return
  }
  units[covered.id] = covered.unit
}

function addAuditedFile(
  auditedFiles: Map<string, AuditedFile>,
  covered: CoveredUnit,
) {
  if (covered.auditedFile === undefined) {
    return
  }
  const { object, file } = covered.auditedFile
  const existing = auditedFiles.get(object)
  assert(
    existing === undefined || JSON.stringify(existing) === JSON.stringify(file),
    `Object ${object} points to two audited files`,
  )
  auditedFiles.set(object, file)
}

function usedReports(
  units: Record<string, Unit>,
  index: AuditIndex,
): Record<string, CoverageReport> {
  const ids = new Set(
    Object.values(units).flatMap((unit) => unit.reports ?? []),
  )
  return Object.fromEntries(
    [...ids].sort().map((id) => {
      const report = index.reports[id]
      assert(report !== undefined, `Unknown report ${id}`)
      const { collections, title, auditor, date } = report
      return [id, { collections, title, auditor, date }]
    }),
  )
}
