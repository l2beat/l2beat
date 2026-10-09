import { UnixTime } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import {
  countFullyCoveredContracts,
  fullyCoveredShare,
  linesCoveredShare,
} from './countFullyCoveredContracts'
import { reportOrigin } from './coverage/coverageReports'
import { buildProjectCoverage } from './coverage/projectCoverage'
import { getAuditsProjectReports } from './getAuditsProjectReports'
import { getAuditsProjects } from './getAuditsProjects'
import {
  getAuditsLaunch,
  getAuditsProjectTimeline,
  toAuditsSummaryTimeline,
} from './getAuditsProjectTimeline'
import type { AuditsSummaryEntry } from './types'

export async function getAuditsSummaryEntries(): Promise<AuditsSummaryEntry[]> {
  const projects = await getAuditsProjects()
  const now = UnixTime.now()

  const entries = projects.map((project): AuditsSummaryEntry => {
    const model = buildProjectCoverage(
      project.auditCoverage,
      project.id,
      project.scalingInfo?.stacks,
    )
    const matchedOwn = [...model.matched].filter(
      (id) =>
        reportOrigin(id, model.coverage, project.id, model.stackCollection) ===
        'own',
    ).length
    const timeline = getAuditsProjectTimeline(
      {
        audits: getAuditsProjectReports(
          model.coverage,
          project.id,
          model.stackCollection,
          model.matched,
        ),
        otherAudits: [],
        ossification: {
          history: project.ossificationHistory,
          href: undefined,
        },
        launch: getAuditsLaunch(project),
      },
      now,
    )
    return {
      id: project.id,
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      href: `/audits/projects/${project.slug}`,
      contracts: model.contracts.length,
      contractsWithoutSource: model.contractsWithoutSource,
      fullyCoveredContracts: countFullyCoveredContracts(model.contracts),
      coverage: { units: model.summary.units, lines: model.summary.lines },
      uniqueUnits: model.summary.uniqueUnits,
      ownReportsCount: matchedOwn,
      sharedReportsCount: model.matched.size - matchedOwn,
      discoveryTimestamp: model.coverage.discoveredAt,
      timeline: toAuditsSummaryTimeline(timeline),
    }
  })
  // The table's default order, so the index column matches it.
  return entries.sort(
    (a, b) =>
      fullyCoveredShare(b) - fullyCoveredShare(a) ||
      linesCoveredShare(b) - linesCoveredShare(a) ||
      a.name.localeCompare(b.name),
  )
}
