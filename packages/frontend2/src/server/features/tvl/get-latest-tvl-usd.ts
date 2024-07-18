import { type ProjectId } from '@l2beat/shared-pure'
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
import { sumValuesPerSource } from './sum-values-per-source'

export function getLatestTvlUsd(
  ...parameters: Parameters<typeof getCachedLatestTvlUsd>
) {
  noStore()
  return getCachedLatestTvlUsd(...parameters)
}

export const getCachedLatestTvlUsd = cache(
  async (
    filterParams: TvlProjectFilter,
  ): Promise<Record<ProjectId, number>> => {
    const filter = createTvlProjectsFilter(filterParams)
    const tvlValues = await getTvlValuesForProjects(
      getTvlProjects().filter(filter),
      '7d',
    )
    return Object.fromEntries(
      Object.entries(tvlValues).map(([projectId, values]) => {
        const latestTimestamp = Math.max(...Object.keys(values).map(Number))
        const latestValues = sumValuesPerSource(
          values[latestTimestamp] ?? [],
          true,
        )
        const sum =
          latestValues.native + latestValues.canonical + latestValues.external
        return [projectId, Number(sum) / 100]
      }),
    )
  },
  ['latestTvlUsd'],
  {
    revalidate: 60 * 10,
  },
)
