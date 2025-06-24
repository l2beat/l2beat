import type { Project } from '@l2beat/config'
import type { SevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'

export interface TvsByTokenType {
  ether: number
  stablecoins: number
  other: number
}
export function getTvsByTokenType(
  ecosystemProjects: Project[],
  tvs: SevenDayTvsBreakdown,
): TvsByTokenType {
  return ecosystemProjects.reduce(
    (acc, curr) => {
      const projectTvs = tvs.projects[curr.id.toString()]

      const other =
        (projectTvs?.breakdown.total ?? 0) -
        (projectTvs?.breakdown.ether ?? 0) -
        (projectTvs?.breakdown.stablecoin ?? 0)

      return {
        ether: acc.ether + (projectTvs?.breakdown.ether ?? 0),
        stablecoins: acc.stablecoins + (projectTvs?.breakdown.stablecoin ?? 0),
        other: acc.other + other,
      }
    },
    {
      ether: 0,
      stablecoins: 0,
      other: 0,
    },
  )
}
