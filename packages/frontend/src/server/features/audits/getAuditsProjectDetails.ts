import type {
  MatchRelation,
  ProjectAuditCoverage,
  UnitRef,
} from '@l2beat/audit-diff'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  type AuditCoverageSource,
  auditCoverageSource,
} from './AuditCoverageSource'
import { toCoverageNumbers } from './getAuditsSummaryEntries'
import type {
  AuditsContractEntry,
  AuditsProjectDetails,
  AuditsReportEntry,
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

  const collectionName = (id: string) =>
    auditCoverageSource.getCollection(id)?.name ?? id

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
          toUnitEntry(unit, file.path, auditCoverageSource, collectionName),
        ),
      })),
    }),
  )

  const reports: AuditsReportEntry[] = []
  for (const id of report.reportIds) {
    const ref = auditCoverageSource.getReport(id)
    if (!ref) continue
    reports.push({
      id: ref.id,
      title: ref.title,
      auditor: ref.auditor,
      reportDate: ref.reportDate,
      url: ref.url,
      origin: originOf(report, ref.collection),
      collection: ref.collection,
      collectionName: collectionName(ref.collection),
    })
  }

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
    reports,
    context: report.context.collections
      .filter((c) => c.rank <= 2)
      .map((c) => ({
        collection: c.id,
        collectionName: collectionName(c.id),
        origin: c.origin,
        relation: describeRelation(c.relation),
      })),
    contractEntries,
  }
}

function originOf(report: ProjectAuditCoverage, collection: string) {
  return (
    report.context.collections.find((c) => c.id === collection)?.origin ??
    'other'
  )
}

export function describeRelation(relation: MatchRelation): string {
  switch (relation.type) {
    case 'own':
      return "the project's own audits"
    case 'fork_of':
      return `fork of ${relation.repository}`
    case 'template':
      return `discovery template ${relation.template}`
    case 'library':
      return 'standard library'
    case 'name':
      return 'matched by unit name'
  }
}

function toUnitEntry(
  unit: UnitRef,
  filePath: string,
  source: AuditCoverageSource,
  collectionName: (id: string) => string,
): AuditsUnitEntry {
  const match = unit.match
  const matchReport = match ? source.getReport(match.reportId) : undefined
  return {
    id: `${filePath}#${unit.startLine}:${unit.unitHash.slice(0, 12)}`,
    unitHash: unit.unitHash,
    contextKey: unit.contextKey,
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
      collection: match.collection,
      collectionName: collectionName(match.collection),
      relation: describeRelation(match.relation),
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
    diffStats: unit.diffStats && {
      added: unit.diffStats.added,
      removed: unit.diffStats.removed,
      ignoredAdded: unit.diffStats.ignoredAdded,
      ignoredRemoved: unit.diffStats.ignoredRemoved,
      ignoredOnly: unit.diffStats.ignoredOnly,
    },
  }
}

// Kept for callers that only need the report, e.g. metadata.
export function getAuditsProjectReport(slug: string) {
  return auditCoverageSource.getProject(slug)
}
