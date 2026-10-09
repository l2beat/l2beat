import type { ProjectAuditCoverage, ProjectScalingStack } from '@l2beat/config'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  AuditsContractEntry,
  AuditsSourceEntry,
  AuditsUnitEntry,
  AuditsUnitMatchEntry,
  AuditsUnitReportRef,
} from '../types'
import {
  type CoverageUnit,
  contractSources,
  selectContracts,
  summarizeUnits,
  type UnitsSummary,
  unitCoveredLines,
  unitStatus,
} from './coverageModel'
import {
  auditedFileUrl,
  matchedReportIds,
  reportCollection,
  reportOrigin,
  reportUrl,
  sortReportIds,
  stackCollectionOf,
  unitOrigin,
} from './coverageReports'

/** One project's coverage turned into the entries the pages show. */
export interface ProjectCoverage {
  projectId: string
  coverage: ProjectAuditCoverage
  selection: 'critical' | 'all'
  /** Collection whose matched audits count as the project's, see coverageReports. */
  stackCollection: string | undefined
  contracts: AuditsContractEntry[]
  contractsWithoutSource: number
  summary: UnitsSummary
  /** Reports referenced by a unit of a shown contract. */
  matched: Set<string>
}

export function buildProjectCoverage(
  coverage: ProjectAuditCoverage,
  projectId: string,
  stacks: ProjectScalingStack[] | undefined,
): ProjectCoverage {
  const { selection, addresses } = selectContracts(coverage)
  const stackCollection = stackCollectionOf(stacks, coverage)
  const toReportRef = (id: string): AuditsUnitReportRef => {
    const report = coverage.reports[id]
    assert(report !== undefined, `Unknown report ${id}`)
    const collection = reportCollection(id, coverage)
    return {
      id,
      title: report.title,
      auditor: report.auditor,
      url: reportUrl(coverage, id),
      origin: reportOrigin(id, coverage, projectId, stackCollection),
      collectionName: coverage.collections[collection]?.name ?? collection,
    }
  }

  const toUnitEntry = (
    flat: string,
    unitId: string,
    startLine: number,
  ): AuditsUnitEntry => {
    const unit = coverage.units[unitId]
    assert(unit !== undefined, `Unknown unit ${unitId}`)
    const status = unitStatus(unit, coverage, projectId)
    return {
      id: `${flat}:${unitId}`,
      flat,
      unitId,
      name: unit.name,
      kind: unit.kind,
      startLine,
      endLine: startLine + unit.lines - 1,
      lines: unit.lines,
      status,
      coveredLines: unitCoveredLines(unit, status),
      match: toMatch(unit),
      changedLines:
        unit.status === 'differs'
          ? {
              added: spanLines(unit.added ?? []),
              removed: groupLines(unit.removed ?? []),
            }
          : undefined,
    }
  }

  const toMatch = (unit: CoverageUnit): AuditsUnitMatchEntry | undefined => {
    if (!unit.audited) return undefined
    const file = coverage.auditedFiles[unit.audited.object]
    assert(file !== undefined, `Unknown audited file ${unit.audited.object}`)
    const reports = sortReportIds(
      unit.reports ?? [],
      coverage,
      projectId,
      stackCollection,
    ).map(toReportRef)
    const report = reports[0]
    assert(report !== undefined, `Matched unit ${unit.name} has no report`)
    const findings = Object.entries(unit.findings ?? {})
      .filter(([, ids]) => ids.length > 0)
      .map(([id, ids]) => ({ report: toReportRef(id), ids }))
    return {
      origin: unitOrigin(unit, coverage, projectId, stackCollection),
      collectionName: report.collectionName,
      auditedName: unit.audited.name,
      report,
      reports,
      repository: file.repository,
      path: file.path,
      commit: file.commit,
      url: auditedFileUrl(file),
      findings,
      findingIds: [...new Set(findings.flatMap((f) => f.ids))],
    }
  }

  const contracts = addresses.map((address): AuditsContractEntry => {
    const contract = coverage.contracts[address]
    assert(contract !== undefined, `Unknown contract ${address}`)
    const sources = contractSources(address, contract).map(
      (source): AuditsSourceEntry => {
        const units =
          source.flat === undefined
            ? []
            : (coverage.flats[source.flat] ?? []).map(([unitId, first]) =>
                toUnitEntry(source.flat as string, unitId, first),
              )
        return {
          address: source.address,
          role: source.role,
          flat: source.flat,
          lines: Math.max(0, ...units.map((u) => u.endLine)),
          units,
        }
      },
    )
    const units = sources.flatMap((s) => s.units)
    const summary = summarizeUnits(units)
    const chainSpecific = ChainSpecificAddress(address)
    return {
      name: contract.name,
      address,
      chain: ChainSpecificAddress.chain(chainSpecific),
      shortAddress: ChainSpecificAddress.address(chainSpecific),
      noSource: sources.every((s) => s.flat === undefined),
      coverage: { units: summary.units, lines: summary.lines },
      sources,
    }
  })

  const shownFlats = contracts.flatMap((c) =>
    c.sources.flatMap((s) => (s.flat ? [s.flat] : [])),
  )
  return {
    projectId,
    coverage,
    selection,
    stackCollection,
    contracts,
    contractsWithoutSource: contracts.filter((c) => c.noSource).length,
    summary: summarizeUnits(
      contracts.flatMap((c) => c.sources.flatMap((s) => s.units)),
    ),
    matched: matchedReportIds(coverage, shownFlats),
  }
}

function spanLines(spans: [number, number][]): number {
  return spans.reduce((sum, [first, last]) => sum + last - first + 1, 0)
}

function groupLines(groups: [number, number, number][]): number {
  return groups.reduce((sum, [, first, last]) => sum + last - first + 1, 0)
}
