import type { Project, Stage } from '@l2beat/config'
import type { SevenDayTvsBreakdown } from '../scaling/tvs/utils/get-7d-tvs-breakdown'

export type TvsByStage = Record<Stage | 'NotApplicable', number>

export function getTvsByStage(
  ecosystemProjects: Project<never, 'scalingStage'>[],
  tvs: SevenDayTvsBreakdown,
): TvsByStage {
  return ecosystemProjects.reduce(
    (acc, curr) => {
      const projectTvs = tvs.projects[curr.id.toString()]
      const stage = curr.scalingStage
      if (
        !stage ||
        stage.stage === 'UnderReview'
      ) {
        return acc
      }

      const stageTvs = acc[stage.stage]
      return {
        ...acc,
        [stage.stage]: stageTvs + (projectTvs?.breakdown.total ?? 0),
      }
    },
    {
      'Stage 0': 0,
      'Stage 1': 0,
      'Stage 2': 0,
      NotApplicable: 0,
    },
  )
}
