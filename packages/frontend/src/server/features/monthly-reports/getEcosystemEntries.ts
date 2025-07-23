import type {
  Project,
  ProjectCustomColors,
  ProjectScalingCategory,
  ProjectScalingStage,
} from '@l2beat/config'
import { assert, type ProjectId, type UnixTime } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { EcosystemUpdate } from '~/content/monthly-updates'
import type { ActivityLatestUopsData } from '~/server/features/scaling/activity/getActivityLatestTps'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getImageParams } from '~/utils/project/getImageParams'
import {
  type ActivityLeaderboard,
  getActivityLeaderboard,
} from '../../../server/features/monthly-reports/getActivityLeaderboard'
import {
  getTvsLeaderboard,
  type TvsLeaderboard,
} from '../../../server/features/monthly-reports/getTvsLeaderboard'
import {
  getEcosystemActivityLeaderboard,
  getEcosystemTvsLeaderboard,
} from './utils/getLeaderboard'

interface BaseLeaderboard {
  slug: string
  name: string
  change: number
}

export interface EcosystemMonthlyUpdateEntry
  extends Omit<EcosystemUpdate, 'ecosystemId'> {
  id: string
  name: string
  colors: ProjectCustomColors
  projects: ProjectId[]
  bannerImg?: string
  allScalingProjects: {
    tvs: number
    uops: number
  }
  newProjects: {
    id: ProjectId
    name: string
    stage: ProjectScalingStage
    slug: string
    description: string
    category: ProjectScalingCategory
    tvs?: number
    uops?: number
    isAppchain: boolean
    badges: BadgeWithParams[]
  }[]
  tvsLeaderboard: {
    gainers: (BaseLeaderboard & { tvs: number })[]
    leaders: (BaseLeaderboard & { tvs: number })[]
  }
  activityLeaderboard: {
    gainers: (BaseLeaderboard & { uops: number })[]
    leaders: (BaseLeaderboard & { uops: number })[]
  }
}

export async function getEcosystemMonthlyUpdateEntries(
  ecosystemUpdateEntries: EcosystemUpdate[],
  allScalingProjects: Project<'isScaling'>[],
  tvs: SevenDayTvsBreakdown,
  activity: ActivityLatestUopsData,
  from: UnixTime,
  to: UnixTime,
): Promise<EcosystemMonthlyUpdateEntry[]> {
  const [projects, ecosystems, newProjects] = await Promise.all([
    ps.getProjects({
      select: ['ecosystemInfo'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    ps.getProjects({
      select: ['ecosystemConfig', 'colors'],
    }),
    ps.getProjects({
      ids: ecosystemUpdateEntries.flatMap(
        (e) => (e.newProjectsIds as ProjectId[]) ?? [],
      ),
      select: ['scalingStage', 'display', 'scalingInfo'],
    }),
  ])

  const [tvsLeaderboard, activityLeaderboard] = await Promise.all([
    getTvsLeaderboard(
      {
        type: 'projects',
        projectIds: projects.map((p) => p.id),
      },
      { type: 'custom', from, to },
    ),
    getActivityLeaderboard(
      {
        type: 'projects',
        projectIds: projects.map((p) => p.id),
      },
      { type: 'custom', from, to },
    ),
  ])

  const allScalingProjectsUops = allScalingProjects.reduce(
    (acc, curr) => acc + (activity[curr.id.toString()]?.pastDayUops ?? 0),
    0,
  )

  return ecosystemUpdateEntries.map((ecosystemUpdateEntry) => {
    const ecosystem = ecosystems.find(
      (p) => p.id === ecosystemUpdateEntry.ecosystemId,
    )
    assert(
      ecosystem,
      `Ecosystem not found for ${ecosystemUpdateEntry.ecosystemId}`,
    )
    return getEcosystemMonthlyUpdateEntry(
      ecosystemUpdateEntry,
      ecosystem,
      projects,
      tvs,
      activity,
      allScalingProjectsUops,
      newProjects,
      tvsLeaderboard,
      activityLeaderboard,
    )
  })
}

function getEcosystemMonthlyUpdateEntry(
  ecosystemUpdateEntry: EcosystemUpdate,
  ecosystem: Project<'ecosystemConfig' | 'colors'>,
  projects: Project<'ecosystemInfo'>[],
  tvs: SevenDayTvsBreakdown,
  activity: ActivityLatestUopsData,
  allScalingProjectsUops: number,
  newProjects: Project<'scalingStage' | 'display' | 'scalingInfo'>[],
  tvsLeaderboardData: TvsLeaderboard,
  activityLeaderboardData: ActivityLeaderboard,
): EcosystemMonthlyUpdateEntry {
  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  const tvsLeaderboard = getEcosystemTvsLeaderboard(
    ecosystemProjects,
    tvsLeaderboardData,
  )

  const activityLeaderboard = getEcosystemActivityLeaderboard(
    ecosystemProjects,
    activityLeaderboardData,
  )

  const bannerImg = getImageParams(
    `/images/monthly-updates/${ecosystemUpdateEntry.ecosystemId}.png`,
  )?.src

  return {
    ...ecosystemUpdateEntry,
    ...ecosystem,
    bannerImg,
    newProjects:
      ecosystemUpdateEntry.newProjectsIds?.map((p) => {
        const project = newProjects.find((n) => n.id === p)
        assert(project, `Project not found for ${p}`)
        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          stage: project.scalingStage,
          description: project.display.description,
          category: project.scalingInfo.type,
          tvs: tvs.projects[p.toString()]?.breakdown.total,
          uops: activity[p.toString()]?.pastDayUops,
          isAppchain: project.scalingInfo.capability === 'appchain',
          badges: project.display.badges
            .map((badge) => getBadgeWithParams(badge))
            .filter((badge) => badge !== undefined),
        }
      }) ?? [],
    colors: ecosystem.colors,
    allScalingProjects: {
      tvs: tvs.total,
      uops: allScalingProjectsUops,
    },
    projects: ecosystemProjects.map((project) => project.id),
    tvsLeaderboard,
    activityLeaderboard,
  }
}
