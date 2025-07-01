import type { Project, ProjectColors } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import type { EcosystemUpdate } from '~/content/monthly-updates'
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
  }
}

export async function getEcosystemMonthlyUpdateEntries(
  ecosystemUpdateEntries: EcosystemUpdate[],
): Promise<EcosystemMonthlyUpdateEntry[]> {
  const [ecosystems, projects, tvs] = await Promise.all([
    ps.getProjects({
      select: ['ecosystemConfig', 'colors'],
    }),
    ps.getProjects({
      select: ['ecosystemInfo'],

      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
    get7dTvsBreakdown({ type: 'layer2' }),
  ])
  return ecosystemUpdateEntries.map((e) => {
    const ecosystem = ecosystems.find((p) => p.id === e.ecosystemId)
    assert(ecosystem, `Ecosystem not found for ${e.ecosystemId}`)
    return getEcosystemMonthlyUpdateEntry(e, ecosystem, projects, tvs)
  })
}

function getEcosystemMonthlyUpdateEntry(
  ecosystemUpdateEntry: EcosystemUpdate,
  ecosystem: Project<'ecosystemConfig' | 'colors'>,
  projects: Project<'ecosystemInfo'>[],
  tvs: SevenDayTvsBreakdown,
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
    },
    projects: ecosystemProjects.map((project) => project.id),
  }
}
