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
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import {
  getLatestTvsTimestamp,
  TVS_BACKEND_DELAY,
} from '../../utils/getLatestTvsTimestamp'
import type { ProjectData, ProjectTvs, ScalingRisk } from './types'

const PROJECT_KEYS = [
  'archivedAt',
  'chainConfig',
  'bridgeInfo',
  'ecosystemInfo',
  'display',
  'statuses',
  'scalingInfo',
  'scalingRisks',
  'scalingStage',
  'tvsInfo',
  'discoveryInfo',
] as const

type ListedProject = Project<never, (typeof PROJECT_KEYS)[number]>

/** Every project, as `/v1/projects` lists it and `/v1/project/:id` returns it. */
export async function getProjectsData(
  ps: ProjectService,
  db: Database,
): Promise<ProjectData[]> {
  const [projects, projectsWithTvs, updateDiffs, tvsTimestamp] =
    await Promise.all([
      ps.getProjects({ optional: [...PROJECT_KEYS] }),
      ps.getProjects({ select: ['tvsConfig'] }),
      db.updateDiff.getAll(),
      getLatestTvsTimestamp(db),
    ])

  const [tvsRows, tvsSyncMetadata] = await Promise.all([
    db.tvsTokenValue.getSummedByProjectAtLatestAndSevenDaysBefore(
      projectsWithTvs.map((p) => p.id.toString()),
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

  return toProjectsData({
    projects,
    tvs: getLatestTvsByProject(
      tvsRows,
      getSyncedProjectIds(
        projectsWithTvs,
        tvsSyncMetadata.map((r) => r.id),
      ),
    ),
    changeReport,
  })
}

export function toProjectsData({
  projects,
  tvs,
  changeReport,
}: {
  projects: ListedProject[]
  tvs: Map<string, ProjectTvs>
  changeReport: ProjectsChangeReportData
}): ProjectData[] {
  return projects.map(
    (project): ProjectData => ({
      id: project.id,
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      chainId: project.chainConfig?.chainId,
      layer: project.scalingInfo?.layer,
      type: project.scalingInfo?.type,
      isArchived: project.archivedAt !== undefined,
      category: project.bridgeInfo?.category,
      hostChain: project.scalingInfo?.hostChain.name,
      stacks: project.scalingInfo?.stacks ?? [],
      ecosystem: project.ecosystemInfo?.id,
      gasTokens: project.chainConfig?.gasTokens ?? [],
      stage:
        project.scalingInfo &&
        getDisplayedScalingStageName(
          project.scalingInfo.type,
          project.scalingStage,
        ),
      purposes: project.scalingInfo?.purposes ?? [],
      badges: project.display?.badges.map((badge) => badge.name) ?? [],
      isUnderReview: !!getUnderReviewStatus({
        isUnderReview: !!project.statuses?.reviewStatus,
        impactfulChange: hasImpactfulChange(changeReport, project.id),
      }),
      risks:
        project.scalingRisks &&
        getL2Risks(
          project.scalingRisks.stacked ?? project.scalingRisks.self,
        ).map(toScalingRisk),
      tvs: tvs.get(project.id.toString()) ?? null,
      associatedTokens:
        project.tvsInfo?.associatedTokens.map((token) => token.symbol) ?? [],
    }),
  )
}

function toScalingRisk({
  name,
  value,
  sentiment,
  description,
  warning,
  regular,
}: ScalingRiskValue): ScalingRisk {
  return {
    name,
    value,
    sentiment,
    description,
    warning: warning && { value: warning.value, sentiment: warning.sentiment },
    regular: regular && {
      value: regular.value,
      sentiment: regular.sentiment,
      description: regular.description,
    },
  }
}

type TvsRow = Awaited<
  ReturnType<
    Database['tvsTokenValue']['getSummedByProjectAtLatestAndSevenDaysBefore']
  >
>[number]

/**
 * Mirrors the frontend's get7dTvsBreakdown, which the website's
 * /api/scaling/summary reads, so a consumer moving over sees the same
 * numbers. A project with no rows, or that the TVS backend has never synced,
 * gets no entry: the caller reports it as null rather than as a zero that
 * reads as "secures nothing".
 */
export function getLatestTvsByProject(
  rows: TvsRow[],
  syncedProjectIds: Set<string>,
): Map<string, ProjectTvs> {
  const result = new Map<string, ProjectTvs>()
  // The query returns at most two rows per project, sorted by timestamp:
  // the one seven days before (optional) followed by the latest.
  for (const [projectId, projectRows] of Object.entries(
    groupBy(rows, (r) => r.project),
  )) {
    if (!syncedProjectIds.has(projectId)) {
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
        ? getRelativeChange(latest.value, sevenDaysAgo.value)
        : null,
    })
  }
  return result
}

/**
 * The projects with a sync record for at least one of their tokens. TVS sync
 * records are kept per token, under the token's id. The ids are matched whole
 * and not by their project prefix, as "arbitrum-" also starts the tokens of
 * arbitrum-orbit.
 */
export function getSyncedProjectIds(
  projects: { id: string; tvsConfig: { id: string }[] }[],
  syncMetadataIds: string[],
): Set<string> {
  const syncedTokenIds = new Set(syncMetadataIds)
  return new Set(
    projects
      .filter((p) => p.tvsConfig.some((token) => syncedTokenIds.has(token.id)))
      .map((p) => p.id),
  )
}

/**
 * Unlike the website's calculatePercentageChange, which shows 0% for both,
 * a change from 0 is unknown and a fall to 0 is -100%.
 */
function getRelativeChange(now: number, then: number): number | null {
  return then === 0 ? null : now / then - 1
}

/** The same window as the frontend's optionToRange('3d') start. */
export function getTvsRangeStart(now: UnixTime): UnixTime {
  const end = UnixTime.toStartOf(now - TVS_BACKEND_DELAY, 'hour')
  return UnixTime.toStartOf(end, 'day') - 3 * UnixTime.DAY
}
