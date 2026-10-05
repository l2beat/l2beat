import type { ProjectAuditCoverage } from '@l2beat/audit-diff'
import { UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getOssificationSeries } from '../projects/ossification/getOssificationSeries'
import { sampleTimeline } from '../projects/ossification/sampleTimeline'
import { auditCoverageSource } from './AuditCoverageSource'
import { getAuditsOwnReports } from './getAuditsOwnReports'
import type { AuditsSummaryEntry, AuditsSummaryTimeline } from './types'

const TIMELINE_WINDOW = 365 * UnixTime.DAY

export async function getAuditsSummaryEntries(): Promise<AuditsSummaryEntry[]> {
  const reports = auditCoverageSource.listProjects()
  const projects = await ps.getProjects({
    slugs: reports.map((r) => r.slug),
    optional: ['tvsConfig', 'defiInfo'],
  })
  const now = UnixTime.now()
  const from = now - TIMELINE_WINDOW

  const entries = await Promise.all(
    reports.map(async (report): Promise<AuditsSummaryEntry> => {
      const project = projects.find((p) => p.slug === report.slug)
      const own = new Set(
        report.context.collections
          .filter((c) => c.origin === 'own')
          .map((c) => c.id),
      )
      const ownReportsCount = report.reportIds.filter((id) =>
        own.has(collectionOf(id)),
      ).length
      const series = project ? await getOssificationSeries(project, from) : null
      const audits = getAuditsOwnReports(report, auditCoverageSource)
      const timeline: AuditsSummaryTimeline = {
        from,
        to: now,
        audits: audits
          .map((audit) => audit.timestamp)
          .filter((timestamp) => timestamp >= from),
        latestAudit: audits.at(-1)?.timestamp ?? null,
        values: series ? sampleTimeline(series.points, from, now) : null,
      }
      return {
        id: report.projectId,
        slug: report.slug,
        name: project?.name ?? report.projectId,
        shortName: project?.shortName,
        icon: manifest.getUrl(`/icons/${report.slug}.png`),
        href: `/audits/projects/${report.slug}`,
        contracts: report.summary.contracts,
        contractsWithoutSource: report.summary.contractsWithoutSource,
        coverage: toCoverageNumbers(report.summary),
        uniqueUnits: report.summary.uniqueUnits,
        ownReportsCount,
        sharedReportsCount: report.reportIds.length - ownReportsCount,
        discoveryTimestamp: report.discoveryTimestamp,
        valueSource: series?.source ?? null,
        timeline,
      }
    }),
  )
  // The table's default order, so the index column matches it.
  return entries.sort(
    (a, b) =>
      linesCoveredShare(b) - linesCoveredShare(a) ||
      a.name.localeCompare(b.name),
  )
}

export function linesCoveredShare({
  coverage: { lines },
}: Pick<AuditsSummaryEntry, 'coverage'>): number {
  return lines.total === 0 ? 0 : lines.covered / lines.total
}

/** Global report ids are `<collection>/<report id>`. */
function collectionOf(reportId: string): string {
  return reportId.split('/')[0] ?? reportId
}

export function toCoverageNumbers(summary: ProjectAuditCoverage['summary']) {
  return { units: summary.units, lines: summary.lines }
}
