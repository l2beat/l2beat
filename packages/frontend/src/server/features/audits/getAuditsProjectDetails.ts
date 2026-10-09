import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { manifest } from '~/utils/Manifest'
import { countFullyCoveredContracts } from './countFullyCoveredContracts'
import {
  ORIGIN_RANK,
  reportCollection,
  reportOrigin,
  reportUrl,
} from './coverage/coverageReports'
import { buildProjectCoverage } from './coverage/projectCoverage'
import {
  getAuditsProjectReports,
  parseReportDate,
} from './getAuditsProjectReports'
import { getAuditsProject } from './getAuditsProjects'
import {
  getAuditsLaunch,
  getAuditsProjectTimeline,
} from './getAuditsProjectTimeline'
import type {
  AuditsOtherReport,
  AuditsProjectDetails,
  AuditsReportEntry,
} from './types'

/**
 * Everything the project page needs except unit sources and diffs, which are
 * fetched per unit through tRPC when a reader expands one.
 */
export async function getAuditsProjectDetails(
  slug: string,
): Promise<AuditsProjectDetails | undefined> {
  const project = await getAuditsProject(slug)
  if (!project) return undefined
  const model = buildProjectCoverage(
    project.auditCoverage,
    project.id,
    project.scalingInfo?.stacks,
  )
  const { coverage, stackCollection } = model

  // Every own report, matched or not, and every other matched report.
  const reports: AuditsReportEntry[] = Object.entries(coverage.reports)
    .flatMap(([id, report]): AuditsReportEntry[] => {
      const origin = reportOrigin(id, coverage, project.id, stackCollection)
      const matched = model.matched.has(id)
      if (origin !== 'own' && !matched) return []
      const collection = reportCollection(id, coverage)
      return [
        {
          id,
          title: report.title,
          auditor: report.auditor,
          reportDate: report.date ?? null,
          url: reportUrl(coverage, id),
          origin,
          collection,
          collectionName: coverage.collections[collection]?.name ?? collection,
          matched,
        },
      ]
    })
    .sort(
      (a, b) =>
        ORIGIN_RANK[a.origin] - ORIGIN_RANK[b.origin] ||
        (b.reportDate ?? '').localeCompare(a.reportDate ?? '') ||
        a.id.localeCompare(b.id),
    )

  const projectHref = getProjectHref(project)
  const audits = getAuditsProjectReports(
    coverage,
    project.id,
    stackCollection,
    model.matched,
  )
  const projectAuditIds = new Set(audits.map((audit) => audit.id))
  const timeline = getAuditsProjectTimeline(
    {
      audits,
      otherAudits: reports
        .filter((r) => !projectAuditIds.has(r.id))
        .flatMap(toOtherReport),
      ossification: {
        history: project.ossificationHistory,
        href: projectHref && `${projectHref}#ossification`,
      },
      launch: getAuditsLaunch(project),
    },
    UnixTime.now(),
  )

  return {
    slug: project.slug,
    projectId: project.id,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    contractSelection: model.selection,
    discoveryTimestamp: coverage.discoveredAt,
    datasetCommit: coverage.dataset.commit,
    datasetUrl: `https://github.com/${coverage.dataset.repository}/tree/${coverage.dataset.commit}`,
    contracts: model.contracts.length,
    contractsWithoutSource: model.contractsWithoutSource,
    fullyCoveredContracts: countFullyCoveredContracts(model.contracts),
    coverage: { units: model.summary.units, lines: model.summary.lines },
    uniqueUnits: model.summary.uniqueUnits,
    reports,
    stackCollectionName:
      stackCollection !== undefined
        ? (coverage.collections[stackCollection]?.name ?? stackCollection)
        : undefined,
    contractEntries: model.contracts,
    projectHref,
    discoUiHref: hasDiscoUi(project)
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
function hasDiscoUi(project: {
  discoveryInfo?: {
    hasDiscoUi: boolean
    baseTimestamp: number | undefined
  }
}): boolean {
  const info = project.discoveryInfo
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

/** Dated matched reports; undated ones have no place on a timeline. */
function toOtherReport(report: AuditsReportEntry): AuditsOtherReport[] {
  const timestamp = parseReportDate(report.reportDate, report.id)
  if (timestamp === undefined) return []
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
