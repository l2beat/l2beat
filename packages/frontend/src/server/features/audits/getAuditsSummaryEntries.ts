import type { ProjectAuditCoverage } from '@l2beat/audit-diff'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { get7dTvsBreakdown } from '../layer2s/tvs/get7dTvsBreakdown'
import { auditCoverageSource } from './AuditCoverageSource'
import type { AuditsSummaryEntry } from './types'

export async function getAuditsSummaryEntries(): Promise<AuditsSummaryEntry[]> {
  const reports = auditCoverageSource.listProjects()
  const [projects, tvs] = await Promise.all([
    ps.getProjects({
      slugs: reports.map((r) => r.slug),
    }),
    get7dTvsBreakdown({
      type: 'projects',
      projectIds: reports.map((r) => ProjectId(r.projectId)),
    }),
  ])

  return reports.map((report) => {
    const project = projects.find((p) => p.slug === report.slug)
    const own = new Set(
      report.context.collections
        .filter((c) => c.origin === 'own')
        .map((c) => c.id),
    )
    const ownReportsCount = report.reportIds.filter((id) =>
      own.has(collectionOf(id)),
    ).length
    const projectTvs = tvs.projects[report.projectId]
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
      tvs: projectTvs && {
        latest: projectTvs.breakdown.total,
        change: projectTvs.change.total,
        changePeriod: projectTvs.changePeriod,
      },
    }
  })
}

/** Global report ids are `<collection>/<report id>`. */
function collectionOf(reportId: string): string {
  return reportId.split('/')[0] ?? reportId
}

export function toCoverageNumbers(summary: ProjectAuditCoverage['summary']) {
  return { units: summary.units, lines: summary.lines }
}
