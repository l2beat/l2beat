import { UnixTime } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import {
  countFullyCoveredContracts,
  fullyCoveredShare,
  linesCoveredShare,
} from './countFullyCoveredContracts'
import { reportOrigin } from './coverage/coverageReports'
import { buildProjectCoverage } from './coverage/projectCoverage'
import { coverageUnderReading } from './coverage/scopeReading'
import { getAuditsCoverageHistory } from './getAuditsCoverageHistory'
import { getAuditsProjectReports } from './getAuditsProjectReports'
import { getAuditsProjects } from './getAuditsProjects'
import {
  getAuditsLaunch,
  getAuditsProjectTimeline,
  toAuditsSummaryTimeline,
} from './getAuditsProjectTimeline'
import type {
  AuditsCoverageHistory,
  AuditsSummaryCoverageHistory,
  AuditsSummaryEntry,
} from './types'

export async function getAuditsSummaryEntries(): Promise<AuditsSummaryEntry[]> {
  const projects = await getAuditsProjects()
  const now = UnixTime.now()

  const entries = projects.map((project): AuditsSummaryEntry => {
    // The table shows the strict reading where a project has a scope: only
    // code an audit report explicitly includes counts, as on the project
    // page. See
    // docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
    const strict =
      project.auditScope &&
      coverageUnderReading(project.auditCoverage, project.auditScope, 'strict')
    const model = buildProjectCoverage(
      strict?.coverage ?? project.auditCoverage,
      project.id,
      project.scalingInfo?.stacks,
      strict && { impliedBy: strict.impliedBy },
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
      coverageHistory: toSummaryCoverageHistory(
        // The history was generated before the readings existed and keeps
        // the base one, so its last point can differ from the columns.
        getAuditsCoverageHistory(
          project.auditCoverage,
          project.id,
          model.stackCollection,
        ),
      ),
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

function toSummaryCoverageHistory(
  history: AuditsCoverageHistory | undefined,
): AuditsSummaryCoverageHistory | null {
  if (history === undefined) return null
  return {
    launch: history.launch,
    points: history.points.map((point) => ({
      timestamp: point.timestamp,
      uncovered: point.lines.uncovered,
    })),
  }
}
