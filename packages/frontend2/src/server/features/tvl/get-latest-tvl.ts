import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getTvlBreakdown } from './get-tvl-breakdown'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import {
  type TvlProjectFilter,
  createTvlProjectsFilter,
} from './project-filter-utils'

export function getLatestTvl(
  ...parameters: Parameters<typeof getCachedLatestTvl>
) {
  noStore()
  return getCachedLatestTvl(...parameters)
}

export const getCachedLatestTvl = cache(
  async ({ ...filterParams }: TvlProjectFilter) => {
    const filter = createTvlProjectsFilter(filterParams)
    const tvlValues = await getTvlValuesForProjects(
      getTvlProjects().filter(filter),
      '7d',
    )
    const projects = Object.fromEntries(
      Object.entries(tvlValues).map(([projectId, values]) => {
        const latestTimestamp = Math.max(...Object.keys(values).map(Number))
        const oldestTimestamp = Math.min(...Object.keys(values).map(Number))
        const latestValues = values[latestTimestamp] ?? []
        const oldestValues = values[oldestTimestamp] ?? []
        const breakdown = getTvlBreakdown(latestValues)
        const oldBreakdown = getTvlBreakdown(oldestValues)
        return [
          projectId,
          {
            breakdown: {
              total: Number(breakdown.total) / 100,
              ether: Number(breakdown.ether) / 100,
              stablecoin: Number(breakdown.stablecoin) / 100,
              associated: Number(breakdown.associated) / 100,
            },
            oldBreakdown: {
              total: Number(oldBreakdown.total) / 100,
              ether: Number(oldBreakdown.ether) / 100,
              stablecoin: Number(oldBreakdown.stablecoin) / 100,
              associated: Number(oldBreakdown.associated) / 100,
            },
            change:
              (Number(breakdown.total) - Number(oldBreakdown.total)) /
              Number(breakdown.total),
          },
        ]
      }),
    )

    const total = Object.values(projects).reduce(
      (acc, { breakdown }) => acc + breakdown.total,
      0,
    )

    return {
      total,
      change:
        Object.values(projects).reduce(
          (acc, { oldBreakdown }) => acc + oldBreakdown.total,
          0,
        ) / total,
      projects,
    }
  },
  ['latestTvl'],
  {
    revalidate: 60 * 10,
  },
)

export type LatestTvl = Awaited<ReturnType<typeof getCachedLatestTvl>>
