import type { Project, ProjectService } from '@l2beat/config'
import {
  buildProjectsChangeReport,
  hasImpactfulChange,
  type ProjectsChangeReportData,
} from '@l2beat/config/build/utils/projectsChangeReport'
import {
  getDisplayedScalingStageName,
  getL2Risks,
  getUnderReviewStatus,
  type ScalingRiskValue,
} from '@l2beat/config/build/utils/scalingAssessment'
import type { Database } from '@l2beat/database'
import { calculatePercentageChange, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import type {
  ScalingRisk,
  ScalingSummary,
  ScalingSummaryProject,
  ScalingSummaryTvs,
} from './types'

/** The backend targets the previous full hour and gets 15 minutes to sync. */
const TVS_BACKEND_DELAY = UnixTime.HOUR + 15 * UnixTime.MINUTE

export async function getScalingSummary(
  ps: ProjectService,
  db: Database,
): Promise<ScalingSummary> {
  const [projects, projectsWithTvs, updateDiffs, tvsTimestamp] =
    await Promise.all([
      getActiveScalingProjects(ps),
      ps.getProjects({ where: ['tvsConfig'] }),
      db.updateDiff.getAll(),
      getLatestTvsTimestamp(db),
    ])

  const tvsProjectIds = new Set(projectsWithTvs.map((p) => p.id.toString()))
  const [tvsRows, tvsSyncMetadata] = await Promise.all([
    db.tvsTokenValue.getSummedByProjectAtLatestAndSevenDaysBefore(
      projects.map((p) => p.id.toString()).filter((id) => tvsProjectIds.has(id)),
      [getTvsRangeStart(UnixTime.now()), tvsTimestamp],
      // The same token filters the website's scaling summary uses
      { excludeAssociatedTokens: false, excludeRwaRestrictedTokens: true },
    ),
    db.syncMetadata.getByFeature('tvs'),
  ])

  const baseTimestamps = new Map(
    projects.map((p) => [p.id.toString(), p.discoveryInfo?.baseTimestamp]),
  )
  const changeReport = buildProjectsChangeReport(updateDiffs, (projectId) =>
    baseTimestamps.get(projectId),
  )

  return toScalingSummary({
    projects,
    tvs: getLatestTvsByProject(
      tvsRows,
      tvsSyncMetadata.map((r) => r.id),
    ),
    changeReport,
    tvsTimestamp,
  })
}

export function toScalingSummary({
  projects,
  tvs,
  changeReport,
  tvsTimestamp,
}: {
  projects: Project<
    'display' | 'statuses' | 'scalingInfo' | 'scalingRisks' | 'tvsInfo',
    'scalingStage'
  >[]
  tvs: Map<string, ScalingSummaryTvs>
  changeReport: ProjectsChangeReportData
  tvsTimestamp: UnixTime
}): ScalingSummary {
  const entries = projects.map(
    (project): ScalingSummaryProject => ({
      id: project.id.toString(),
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      layer: project.scalingInfo.layer,
      type: project.scalingInfo.type,
      hostChain: project.scalingInfo.hostChain.name,
      stacks: project.scalingInfo.stacks ?? [],
      purposes: project.scalingInfo.purposes,
      badges: project.display.badges.map((badge) => badge.name),
      stage: getDisplayedScalingStageName(
        project.scalingInfo.type,
        project.scalingStage,
      ),
      isUnderReview: !!getUnderReviewStatus({
        isUnderReview: !!project.statuses.reviewStatus,
        impactfulChange: hasImpactfulChange(changeReport, project.id),
      }),
      risks: getL2Risks(
        project.scalingRisks.stacked ?? project.scalingRisks.self,
      ).map(toScalingRisk),
      tvs: tvs.get(project.id.toString()) ?? null,
      associatedTokens: project.tvsInfo.associatedTokens.map((token) => ({
        symbol: token.symbol,
        icon: token.icon,
      })),
    }),
  )

  return {
    tvsTimestamp,
    projects: entries.sort(
      (a, b) => (b.tvs?.breakdown.total ?? -1) - (a.tvs?.breakdown.total ?? -1),
    ),
  }
}

function getActiveScalingProjects(ps: ProjectService) {
  return ps.getProjects({
    select: ['display', 'statuses', 'scalingInfo', 'scalingRisks', 'tvsInfo'],
    optional: ['scalingStage', 'discoveryInfo'],
    whereNot: ['archivedAt'],
  })
}

function toScalingRisk({
  name,
  value,
  sentiment,
  description,
  warning,
}: ScalingRiskValue): ScalingRisk {
  return {
    name,
    value,
    sentiment,
    description,
    warning: warning && { value: warning.value, sentiment: warning.sentiment },
  }
}

type TvsRow = Awaited<
  ReturnType<
    Database['tvsTokenValue']['getSummedByProjectAtLatestAndSevenDaysBefore']
  >
>[number]

/**
 * Mirrors the frontend's get7dTvsBreakdown, which the old /api/scaling/summary
 * reads, so a consumer moving over sees the same numbers. A project with no
 * rows, or that the TVS backend has never synced, gets no entry: the caller
 * reports it as null rather than as a zero that reads as "secures nothing".
 */
export function getLatestTvsByProject(
  rows: TvsRow[],
  syncMetadataIds: string[],
): Map<string, ScalingSummaryTvs> {
  const result = new Map<string, ScalingSummaryTvs>()
  // The query returns at most two rows per project, sorted by timestamp:
  // the one seven days before (optional) followed by the latest.
  for (const [projectId, projectRows] of Object.entries(
    groupBy(rows, (r) => r.project),
  )) {
    // Sync metadata ids are <projectId>-<tokenId>, e.g. "arbitrum-USDC"
    if (!syncMetadataIds.some((id) => id.startsWith(`${projectId}-`))) {
      continue
    }
    const latest = projectRows.at(-1)
    if (!latest) {
      continue
    }
    const sevenDaysAgo = projectRows.length === 2 ? projectRows[0] : undefined
    result.set(projectId, {
      timestamp: latest.timestamp,
      breakdown: {
        total: latest.value,
        ether: latest.ether,
        stablecoin: latest.stablecoin,
        associated: latest.associated,
      },
      change7d: sevenDaysAgo
        ? calculatePercentageChange(latest.value, sevenDaysAgo.value)
        : null,
    })
  }
  return result
}

/** The same window as the frontend's optionToRange('3d') start. */
export function getTvsRangeStart(now: UnixTime): UnixTime {
  const end = UnixTime.toStartOf(now - TVS_BACKEND_DELAY, 'hour')
  return UnixTime.toStartOf(end, 'day') - 3 * UnixTime.DAY
}

/** The hour the backend is syncing TVS towards, as the frontend reads it. */
async function getLatestTvsTimestamp(db: Database): Promise<UnixTime> {
  return (
    (await db.syncMetadata.getMaxTargetForFeature('tvs')) ??
    UnixTime.toStartOf(UnixTime.now() - TVS_BACKEND_DELAY, 'hour')
  )
}

