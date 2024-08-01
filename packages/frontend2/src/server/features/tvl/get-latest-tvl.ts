import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import {
  type TvlProjectFilter,
  createTvlProjectsFilter,
} from './project-filter-utils'
import { getTvlBreakdown } from './get-tvl-breakdown'

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
    return Object.fromEntries(
      Object.entries(tvlValues).map(([projectId, values]) => {
        const latestTimestamp = Math.max(...Object.keys(values).map(Number))
        const latestValues = values[latestTimestamp] ?? []
        const breakdown = getTvlBreakdown(latestValues)
        return [
          projectId,
          {
            total: Number(breakdown.total) / 100,
            ether: Number(breakdown.ether) / 100,
            stablecoin: Number(breakdown.stablecoin) / 100,
            associated: Number(breakdown.associated) / 100,
          },
        ]
      }),
    )
  },
  ['latestTvl'],
  {
    revalidate: 60 * 10,
  },
)

export type LatestTvl = Awaited<ReturnType<typeof getCachedLatestTvl>>
