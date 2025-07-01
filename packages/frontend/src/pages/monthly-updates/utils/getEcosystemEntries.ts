import type { Project, ProjectColors } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { EcosystemUpdate } from '~/content/monthly-updates'
import { getActivityLatestUops } from '~/server/features/scaling/activity/getActivityLatestTps'
import {
  type SevenDayTvsBreakdown,
  get7dTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'

export interface EcosystemMonthlyUpdateEntry extends EcosystemUpdate {
  colors: ProjectColors
  projects: ProjectId[]
  allScalingProjects: {
    tvs: number
    uops: number
  }
}

export async function getEcosystemMonthlyUpdateEntries(
  ecosystemUpdateEntries: EcosystemUpdate[],
): Promise<EcosystemMonthlyUpdateEntry[]> {
  const allScalingProjects = await ps.getProjects({
    where: ['isScaling'],
  })
  const [ecosystems, projects, tvs, activity] = await Promise.all([
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
      allScalingProjectsUops,
    )
  })
}

function getEcosystemMonthlyUpdateEntry(
  ecosystemUpdateEntry: EcosystemUpdate,
  ecosystem: Project<'ecosystemConfig' | 'colors'>,
  projects: Project<'ecosystemInfo'>[],
  tvs: SevenDayTvsBreakdown,
  allScalingProjectsUops: number,
): EcosystemMonthlyUpdateEntry {
  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  return {
    ...ecosystemUpdateEntry,
    ...ecosystem,
    colors: ecosystem.colors,
    allScalingProjects: {
      tvs: tvs.total,
      uops: allScalingProjectsUops,
    },
    projects: ecosystemProjects.map((project) => project.id),
  }
}
