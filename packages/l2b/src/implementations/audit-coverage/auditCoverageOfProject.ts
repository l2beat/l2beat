import {
  ConfigReader,
  type EntryParameters,
  get$Implementations,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  AuditCoverage,
  AuditedFile,
  Contract,
  CoverageCollection,
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
  dataset: { repository: string; commit: string }
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
  const contracts: Record<string, Contract> = {}
  const auditedFiles = new Map<string, AuditedFile>()
  const entries = discovered.entries.filter((e) => e.type === 'Contract')
  const count = entries.reduce(
    (sum, e) => sum + 1 + get$Implementations(e.values).length,
    0,
  )
  let done = 0
  for (const entry of entries) {
    const addresses = [entry.address, ...get$Implementations(entry.values)]
    const sources: string[] = []
    for (const address of addresses) {
      onProgress(address, done++, count)
      const source = await getDeployedSource(address)
      if (source.kind !== 'flat') {
        sources.push(source.kind)
        continue
      }
      const flat = createHash('sha256').update(source.flat).digest('hex')
      sources.push(flat)
      if (flats[flat] !== undefined) {
        continue
      }
      flats[flat] = coverFlat(
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
    contracts[entry.address] = toContract(entry, addresses, sources)
  }
  const reports = reportsOf(project, units, inputs.index)
  return {
    schema_version: '1.0.0',
    project,
    dataset: inputs.dataset,
    discoveredAt: discovered.timestamp,
    collections: collectionsOf(reports, inputs.index),
    reports,
    auditedFiles: Object.fromEntries(
      [...auditedFiles].sort(([a], [b]) => (a < b ? -1 : 1)),
    ),
    units,
    flats,
    contracts,
  }
}

function toContract(
  entry: EntryParameters,
  addresses: ChainSpecificAddress[],
  sources: string[],
): Contract {
  const [source, ...implementations] = sources
  assert(source !== undefined, `${entry.address} has no source`)
  assert(entry.name !== undefined, `${entry.address} has no name`)
  const contract: Contract = { name: entry.name, source }
  if (entry.critical !== undefined) {
    contract.critical = entry.critical
  }
  if (implementations.length > 0) {
    contract.implementations = Object.fromEntries(
      implementations.map((s, i) => [addresses[i + 1], s]),
    )
  }
  return contract
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

function reportsOf(
  project: string,
  units: Record<string, Unit>,
  index: AuditIndex,
): Record<string, CoverageReport> {
  const ids = new Set(
    Object.values(units).flatMap((unit) => unit.reports ?? []),
  )
  for (const [id, report] of Object.entries(index.reports)) {
    if (report.collections.includes(project)) {
      ids.add(id)
    }
  }
  return Object.fromEntries(
    [...ids].sort().map((id) => {
      const report = index.reports[id]
      assert(report !== undefined, `Unknown report ${id}`)
      const { collections, title, auditor, date, document } = report
      if (date === null) {
        return [id, { collections, title, auditor, document }]
      }
      return [id, { collections, title, auditor, date, document }]
    }),
  )
}

function collectionsOf(
  reports: Record<string, CoverageReport>,
  index: AuditIndex,
): Record<string, CoverageCollection> {
  const ids = new Set(Object.values(reports).flatMap((r) => r.collections))
  return Object.fromEntries(
    [...ids].sort().map((id) => {
      const collection = index.collections[id]
      assert(collection !== undefined, `Unknown collection ${id}`)
      return [id, { name: collection.name, kind: collection.kind }]
    }),
  )
}
