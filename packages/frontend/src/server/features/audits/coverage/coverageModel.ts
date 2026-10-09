import type { ProjectAuditCoverage } from '@l2beat/config'
import type { AuditStatusCounts, AuditUnitStatus } from '../types'

// Pure derivations from one project's `auditCoverage`, the output of
// `l2b audit-coverage`. Field meanings are documented in
// packages/l2b/src/implementations/audit-coverage/README.md.

export type CoverageUnit = ProjectAuditCoverage['units'][string]
export type CoverageContract = ProjectAuditCoverage['contracts'][string]

/** A `source` is a flat hash, 'unverified' or 'non-solidity'. */
export function isFlatHash(source: string): boolean {
  return /^[0-9a-f]{64}$/.test(source)
}

/**
 * The contracts the dashboard shows: the current critical perimeter when the
 * project has one (critical is true or its window has not ended), the same
 * rule as ossification, else every contract discovery found.
 */
export function selectContracts(coverage: ProjectAuditCoverage): {
  selection: 'critical' | 'all'
  addresses: string[]
} {
  const addresses = Object.keys(coverage.contracts)
  const critical = addresses.filter((address) => {
    const value = coverage.contracts[address]?.critical
    return value === true || (value !== undefined && !value.untilTimestamp)
  })
  return critical.length > 0
    ? { selection: 'critical', addresses: critical }
    : { selection: 'all', addresses }
}

/**
 * Status shown for a unit. Identical code is shown as an audited standard
 * library when every report that audited it belongs to library collections
 * only; an audit of any project, the project's own or another, shows it as
 * identical.
 */
export function unitStatus(
  unit: CoverageUnit,
  coverage: ProjectAuditCoverage,
  _projectId: string,
): AuditUnitStatus {
  switch (unit.status) {
    case 'none':
      return 'unaudited'
    case 'differs':
      return 'differs'
    case 'identical': {
      const collections = (unit.reports ?? []).flatMap(
        (id) => coverage.reports[id]?.collections ?? [],
      )
      const libraryOnly =
        collections.length > 0 &&
        collections.every((id) => coverage.collections[id]?.kind === 'library')
      return libraryOnly ? 'library' : 'identical'
    }
  }
}

export function unitCoveredLines(
  unit: CoverageUnit,
  status: AuditUnitStatus,
): number {
  switch (status) {
    case 'identical':
    case 'library':
      return unit.lines
    case 'differs':
      return unit.covered ?? 0
    case 'unaudited':
      return 0
  }
}

export interface ContractSource {
  /** Chain specific address of the verified source. */
  address: string
  role: 'proxy' | 'implementation'
  /** sha256 of the flat source; undefined without verified Solidity. */
  flat: string | undefined
}

/**
 * The verified sources of a contract in display order: the contract's own
 * source, which is the proxy when implementations exist, then each
 * implementation as discovery lists them.
 */
export function contractSources(
  address: string,
  contract: CoverageContract,
): ContractSource[] {
  const implementations = Object.entries(contract.implementations ?? {})
  const flatOf = (source: string) => (isFlatHash(source) ? source : undefined)
  return [
    {
      address,
      role: implementations.length > 0 ? 'proxy' : 'implementation',
      flat: flatOf(contract.source),
    },
    ...implementations.map(
      ([implementation, source]): ContractSource => ({
        address: implementation,
        role: 'implementation',
        flat: flatOf(source),
      }),
    ),
  ]
}

export interface UnitSummaryInput {
  unitId: string
  status: AuditUnitStatus
  lines: number
  coveredLines: number
}

export interface UnitsSummary {
  /** Deployed unit instances per status. */
  units: AuditStatusCounts
  /** Same, deduplicated by unit id. */
  uniqueUnits: AuditStatusCounts
  lines: { total: number; covered: number; uncovered: number }
}

export function summarizeUnits(units: UnitSummaryInput[]): UnitsSummary {
  const counts = emptyCounts()
  const unique = emptyCounts()
  const seen = new Set<string>()
  let total = 0
  let covered = 0
  for (const unit of units) {
    counts[unit.status]++
    if (!seen.has(unit.unitId)) {
      seen.add(unit.unitId)
      unique[unit.status]++
    }
    total += unit.lines
    covered += Math.min(unit.lines, unit.coveredLines)
  }
  return {
    units: counts,
    uniqueUnits: unique,
    lines: { total, covered, uncovered: total - covered },
  }
}

export function emptyCounts(): AuditStatusCounts {
  return { identical: 0, library: 0, differs: 0, unaudited: 0 }
}
