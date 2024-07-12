import {
  unstable_noStore as noStore,
  unstable_cache as cache,
} from 'next/cache'
import {
  type TvlProjectFilter,
  createTvlProjectsFilter,
} from './project-filter-utils'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import { getTvlProjects } from './get-tvl-projects'
import { type ProjectId } from '@l2beat/shared-pure'
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
        const latestValues = sumValuesPerSource(values[latestTimestamp] ?? [])
        const sum =
          latestValues.native + latestValues.canonical + latestValues.external
        return [projectId, Number(sum) / 100]
      }),
    )
  },
)
