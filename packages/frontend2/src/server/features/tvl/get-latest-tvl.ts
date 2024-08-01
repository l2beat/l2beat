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
        const summed = sumValuesPerSource(latestValues, {
          forTotal: true,
          excludeAssociatedTokens: false,
        })
        const total = summed.canonical + summed.external + summed.native
        const { associated, ether, stablecoin } = latestValues.reduce(
          (acc, curr) => {
            acc.associated +=
              curr.canonicalAssociated +
              curr.externalAssociated +
              curr.nativeAssociated
            acc.ether += curr.ether
            acc.stablecoin += curr.stablecoin
            return acc
          },
          {
            associated: 0n,
            ether: 0n,
            stablecoin: 0n,
          },
        )
        return [
          projectId,
          {
            total: Number(total) / 100,
            associated: Number(associated) / 100,
            ether: Number(ether) / 100,
            stablecoin: Number(stablecoin) / 100,
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
