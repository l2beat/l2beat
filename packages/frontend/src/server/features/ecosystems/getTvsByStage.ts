import type { Project, Stage } from '@l2beat/config'
import type { SevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { getActiveEcosystemProjects } from './getActiveEcosystemProjects'

export type TvsByStage = Record<
  Stage | 'NotApplicable',
  {
    tvs: number
    projectCount: number
  }
>

export function getTvsByStage(
  ecosystemProjects: Project<
    'ecosystemInfo',
    'scalingStage' | 'archivedAt' | 'isUpcoming'
  >[],
  tvs: SevenDayTvsBreakdown,
): TvsByStage {
  const activeProjects = getActiveEcosystemProjects(ecosystemProjects)

  return activeProjects.reduce(
    (acc, curr) => {
      const projectTvs = tvs.projects[curr.id.toString()]
      const stage = curr.scalingStage
      if (!stage || stage.stage === 'UnderReview') {
        return acc
      }

      const stageTvs = acc[stage.stage]
      acc[stage.stage] = {
        tvs: stageTvs.tvs + (projectTvs?.breakdown.total ?? 0),
        projectCount: stageTvs.projectCount + 1,
      }
      return acc
    },
    {
      'Stage 0': { tvs: 0, projectCount: 0 },
      'Stage 1': { tvs: 0, projectCount: 0 },
      'Stage 2': { tvs: 0, projectCount: 0 },
      NotApplicable: { tvs: 0, projectCount: 0 },
    },
  )
}
