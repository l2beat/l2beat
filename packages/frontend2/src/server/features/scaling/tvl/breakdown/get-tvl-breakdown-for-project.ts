import {
  ConfigMapping,
  type Layer2,
  type Layer3,
  getTvlAmountsConfigForProject,
  getTvlPricesConfig,
  toBackendProject,
} from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getTvlBreakdown } from './get-tvl-breakdown'

export type ProjectTvlBreakdown = Awaited<
  ReturnType<ReturnType<typeof getTvlBreakdown>>
>

export async function getTvlBreakdownForProject(
  ...parameters: Parameters<typeof getCachedTvlBreakdownForProject>
) {
  noStore()
  const maybeCached = await getCachedTvlBreakdownForProject(...parameters)

  // Next's using plain JSON.Stringify to cache the data, so we need to re-parse UnixTime
  return {
    ...maybeCached,
    dataTimestamp: new UnixTime(+maybeCached.dataTimestamp),
  }
}

export const getCachedTvlBreakdownForProject = cache(
  async (project: Layer2 | Layer3) => {
    const backendProject = toBackendProject(project)

    const amountsConfigs = getTvlAmountsConfigForProject(backendProject)
    const priceConfigs = getTvlPricesConfig()

    const configMapping = new ConfigMapping(priceConfigs, amountsConfigs, [
      backendProject.projectId,
    ])

    return getTvlBreakdown(configMapping)(backendProject.projectId)
  },
  ['getCachedTvlBreakdownForProject'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)
