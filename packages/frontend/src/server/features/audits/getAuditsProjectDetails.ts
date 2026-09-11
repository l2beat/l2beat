import type { ProjectAuditCoverage, UnitCoverage } from '@l2beat/audit-diff'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { auditCoverageSource } from './AuditCoverageSource'
import { toCoverageNumbers } from './getAuditsSummaryEntries'
import type {
  AuditsContractEntry,
  AuditsProjectDetails,
  AuditsUnitEntry,
} from './types'

/**
 * Everything the project page needs except unit sources and diff hunks, which
 * are large and fetched per unit through tRPC when a reader expands one.
 */
export async function getAuditsProjectDetails(
  slug: string,
): Promise<AuditsProjectDetails | undefined> {
  const report = auditCoverageSource.getProject(slug)
  if (!report) return undefined
  const project = await ps.getProject({ slug })

  const libraryNames = new Map(report.libraries.map((l) => [l.id, l.name]))
  const reportsById = new Map(report.reports.map((r) => [r.id, r]))

  const contractEntries: AuditsContractEntry[] = report.contracts.map(
    (contract) => ({
      name: contract.name,
      address: contract.address,
      chain: contract.chain,
      template: contract.template,
      zk: contract.zk,
      noSource: contract.noSource,
      coverage: toCoverageNumbers(contract.summary),
      files: contract.files.map((file) => ({
        path: file.path,
        role: file.role,
        lines: file.lines,
        units: file.units.map((unit) =>
          toUnitEntry(unit, libraryNames, reportsById),
        ),
      })),
    }),
  )

  return {
    slug: report.slug,
    projectId: report.projectId,
    name: project?.name ?? report.projectId,
    icon: manifest.getUrl(`/icons/${report.slug}.png`),
    contractSelection: report.contractSelection,
    discoveryTimestamp: report.discoveryTimestamp,
    generatedAt: report.generatedAt,
    datasetRevision: report.datasetRevision,
    contracts: report.summary.contracts,
    contractsWithoutSource: report.summary.contractsWithoutSource,
    coverage: toCoverageNumbers(report.summary),
    uniqueUnits: report.summary.uniqueUnits,
    reports: report.reports.map((r) => ({
      id: r.id,
      title: r.title,
      auditor: r.auditor,
      reportDate: r.reportDate,
      url: r.url,
      origin: r.origin,
      libraryName: r.libraryId ? libraryNames.get(r.libraryId) : undefined,
    })),
    libraries: report.libraries,
    contractEntries,
  }
}

function toUnitEntry(
  unit: UnitCoverage,
  libraryNames: Map<string, string>,
  reportsById: Map<string, ProjectAuditCoverage['reports'][number]>,
): AuditsUnitEntry {
  const match = unit.match
  const matchReport = match ? reportsById.get(match.reportId) : undefined
  return {
    id: unit.id,
    name: unit.name,
    kind: unit.kind,
    startLine: unit.startLine,
    endLine: unit.endLine,
    lines: unit.lines,
    status: unit.status,
    coveredLines: unit.coveredLines,
    warnings: unit.warnings,
    match: match && {
      origin: match.origin,
      libraryName: match.libraryId
        ? libraryNames.get(match.libraryId)
        : undefined,
      auditedName: match.auditedName,
      renamed: match.auditedName !== unit.name,
      matchedBy: match.matchedBy,
      similarity: match.similarity,
      reportId: match.reportId,
      reportTitle: matchReport?.title ?? match.reportId,
      auditor: matchReport?.auditor ?? '',
      reportUrl: matchReport?.url,
      repository: match.repository,
      path: match.path,
      commit: match.commit,
      commitTimestamp: match.commitTimestamp,
      url: match.url,
      auditStatus: match.auditStatus,
      reviewPhase: match.reviewPhase,
      coverage: match.coverage,
      majorFindings: match.majorFindings,
      laterAuditedVersionExists: match.laterAuditedVersionExists,
      totalVersions: match.totalVersions,
    },
    diffStats: unit.diff && {
      added: unit.diff.added,
      removed: unit.diff.removed,
      ignoredAdded: unit.diff.ignoredAdded,
      ignoredRemoved: unit.diff.ignoredRemoved,
      ignoredOnly: unit.diff.ignoredOnly,
    },
  }
}

// Kept for callers that only need the report, e.g. metadata.
export function getAuditsProjectReport(slug: string) {
  return auditCoverageSource.getProject(slug)
}
