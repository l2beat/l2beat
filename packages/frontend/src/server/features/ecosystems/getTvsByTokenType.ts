import type { Project } from '@l2beat/config'
import type { SevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'

export interface TvsByTokenType {
  ether: number
  stablecoin: number
  btc: number
  other: number
  rwaPublic: number
  rwaRestricted: number
}
export function getTvsByTokenType(
  ecosystemProjects: Project[],
  tvs: SevenDayTvsBreakdown,
): TvsByTokenType {
  return ecosystemProjects.reduce(
    (acc, curr) => {
      const projectTvs = tvs.projects[curr.id.toString()]

      return {
        ether: acc.ether + (projectTvs?.breakdown.ether ?? 0),
        stablecoin: acc.stablecoin + (projectTvs?.breakdown.stablecoin ?? 0),
        btc: acc.btc + (projectTvs?.breakdown.btc ?? 0),
        other: acc.other + (projectTvs?.breakdown.other ?? 0),
        rwaPublic: acc.rwaPublic + (projectTvs?.breakdown.rwaPublic ?? 0),
        rwaRestricted:
          acc.rwaRestricted + (projectTvs?.breakdown.rwaRestricted ?? 0),
      }
    },
    {
      ether: 0,
      stablecoin: 0,
      btc: 0,
      other: 0,
      rwaPublic: 0,
      rwaRestricted: 0,
    },
  )
}
