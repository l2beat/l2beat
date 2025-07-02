import type {
  Project,
  ProjectColors,
  ProjectScalingCategory,
  ProjectScalingStage,
} from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { EcosystemUpdate } from '~/content/monthly-updates'
import {
  type ActivityLatestUopsData,
  getActivityLatestUops,
} from '~/server/features/scaling/activity/getActivityLatestTps'
import {
  type SevenDayTvsBreakdown,
  get7dTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'

export interface EcosystemMonthlyUpdateEntry extends EcosystemUpdate {
  colors: ProjectColors
  projects: ProjectId[]
  allScalingProjects: {
    tvs: number
    uops: number
  }
  newProjects: {
    id: ProjectId
    name: string
    stage: ProjectScalingStage
    description: string
    category: ProjectScalingCategory
    tvs?: number
    uops?: number
    isAppchain: boolean
    badges: BadgeWithParams[]
  }[]
}

export async function getEcosystemMonthlyUpdateEntries(
  ecosystemUpdateEntries: EcosystemUpdate[],
): Promise<EcosystemMonthlyUpdateEntry[]> {
  const allScalingProjects = await ps.getProjects({
    where: ['isScaling'],
  })
  const [ecosystems, projects, tvs, activity, newProjects] = await Promise.all([
    ps.getProjects({
      select: ['ecosystemConfig', 'colors'],
    }),
    ps.getProjects({
      select: ['ecosystemInfo'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }),
    getActivityLatestUops(allScalingProjects),
    ps.getProjects({
      ids: ecosystemUpdateEntries.flatMap(
        (e) => (e.newProjectsIds as ProjectId[]) ?? [],
      ),
      select: ['scalingStage', 'display', 'scalingInfo'],
    }),
  ])

  const allScalingProjectsUops = allScalingProjects.reduce(
    (acc, curr) => acc + (activity[curr.id.toString()]?.pastDayUops ?? 0),
    0,
  )

  return ecosystemUpdateEntries.map((e) => {
    const ecosystem = ecosystems.find((p) => p.id === e.ecosystemId)
    assert(ecosystem, `Ecosystem not found for ${e.ecosystemId}`)
    return getEcosystemMonthlyUpdateEntry(
      e,
      ecosystem,
      projects,
      tvs,
      activity,
      allScalingProjectsUops,
      newProjects,
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
): EcosystemMonthlyUpdateEntry {
  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  return {
    ...ecosystemUpdateEntry,
    ...ecosystem,
    newProjects:
      ecosystemUpdateEntry.newProjectsIds?.map((p) => {
        const project = newProjects.find((n) => n.id === p)
        assert(project, `Project not found for ${p}`)
        return {
          id: project.id,
          name: project.name,
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
  }
}
