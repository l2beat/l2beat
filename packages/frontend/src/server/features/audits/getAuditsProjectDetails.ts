import type {
  MatchRelation,
  ProjectAuditCoverage,
  UnitRef,
} from '@l2beat/audit-diff'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  type AuditCoverageSource,
  auditCoverageSource,
} from './AuditCoverageSource'
import { countFullyCoveredContracts } from './countFullyCoveredContracts'
import { getAuditsOwnReports, parseReportDate } from './getAuditsOwnReports'
import {
  getAuditsLaunch,
  getAuditsProjectTimeline,
} from './getAuditsProjectTimeline'
import { toCoverageNumbers } from './getAuditsSummaryEntries'
import type {
  AuditsContractEntry,
  AuditsProjectDetails,
  AuditsReportEntry,
  AuditsSharedReport,
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
  const project = await ps.getProject({
    slug,
    optional: [
      'ossificationHistory',
      'chainConfig',
      'discoveryInfo',
      'defiInfo',
      'scalingInfo',
      'privacyInfo',
    ],
  })

  const collectionName = (id: string) =>
    auditCoverageSource.getCollection(id)?.name ?? id

  const contractEntries: AuditsContractEntry[] = report.contracts.map(
    (contract) => ({
      name: contract.name,
      address: contract.address,
      chain: contract.chain,
      template: contract.template,
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

  const projectHref = project && getProjectHref(project)
  const timeline = getAuditsProjectTimeline(
    {
      audits: getAuditsOwnReports(report, auditCoverageSource),
      sharedAudits: reports.flatMap(toSharedReport),
      ossification: {
        history: project?.ossificationHistory,
        href: projectHref && `${projectHref}#ossification`,
      },
      launch: project ? getAuditsLaunch(project) : null,
    },
    UnixTime.now(),
  )

  return {
    slug: report.slug,
    projectId: report.projectId,
    name: project?.name ?? report.projectId,
    shortName: project?.shortName,
    icon: manifest.getUrl(`/icons/${report.slug}.png`),
    contractSelection: report.contractSelection,
    discoveryTimestamp: report.discoveryTimestamp,
    generatedAt: report.generatedAt,
    datasetRevision: report.datasetRevision,
    contracts: report.summary.contracts,
    contractsWithoutSource: report.summary.contractsWithoutSource,
    fullyCoveredContracts: countFullyCoveredContracts(report.contracts),
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
    projectHref,
    discoUiHref:
      project && hasDiscoUi(project)
        ? `https://disco.l2beat.com/ui/p/${project.id}`
        : undefined,
    timeline,
  }
}

/**
 * Disco serves every project with a discovered.json, but `hasDiscoUi` is only
 * derived for scaling projects, see adjustDiscoveryInfo. Privacy and DeFi
 * projects keep the template's false, so the base timestamp decides.
 */
function hasDiscoUi(
  project:
    | {
        discoveryInfo?: {
          hasDiscoUi: boolean
          baseTimestamp: number | undefined
        }
      }
    | undefined,
): boolean {
  const info = project?.discoveryInfo
  return info?.hasDiscoUi === true || info?.baseTimestamp !== undefined
}

function getProjectHref(project: {
  slug: string
  scalingInfo?: unknown
  privacyInfo?: unknown
  defiInfo?: unknown
}): string | undefined {
  if (project.scalingInfo) return `/layer2s/projects/${project.slug}`
  if (project.privacyInfo) return `/privacy/projects/${project.slug}`
  if (project.defiInfo && env.CLIENT_SIDE_DEFI_ENABLED) {
    return `/defi/projects/${project.slug}`
  }
}

/** Dated reports of other collections; undated ones have no place on a timeline. */
function toSharedReport(report: AuditsReportEntry): AuditsSharedReport[] {
  const timestamp = parseReportDate(report.reportDate, report.id)
  if (report.origin === 'own' || timestamp === undefined) return []
  return [
    {
      id: report.id,
      title: report.title,
      auditor: report.auditor,
      timestamp,
      url: report.url,
      origin: report.origin,
      collectionName: report.collectionName,
    },
  ]
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
      findingIds: match.findingIds,
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
