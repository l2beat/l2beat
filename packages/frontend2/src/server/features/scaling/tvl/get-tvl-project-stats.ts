import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { getTokenBreakdown } from './utils/get-token-breakdown'
import { getTvlBreakdown } from './utils/get-tvl-breakdown'
import { getTvlProjects } from './utils/get-tvl-projects'
import { getTvlValuesForProjects } from './utils/get-tvl-values-for-projects'

export async function getTvlProjectStats(id: ProjectId) {
  if (env.MOCK) {
    return getMockTvlProjectStats()
  }
  noStore()
  return getCachedTvlProjectStats(id)
}

export type TvlProjectStats = Awaited<
  ReturnType<typeof getCachedTvlProjectStats>
>
const getCachedTvlProjectStats = cache(
  async (id: ProjectId) => {
    const projects = getTvlProjects().filter((project) => project.id === id)
    const tvlValues = await getTvlValuesForProjects(projects, '7d')
    const projectTvlValues = tvlValues[id]
    if (!projectTvlValues) {
      return
    }

    const latestTimestamp = Math.max(
      ...Object.keys(projectTvlValues).map(Number),
    )
    const oldestTimestamp = Math.min(
      ...Object.keys(projectTvlValues).map(Number),
    )

    const latestValues = projectTvlValues[latestTimestamp] ?? []
    const breakdown = getTokenBreakdown(latestValues)
    const tvlBreakdown = getTvlBreakdown(latestValues)
    const oldTvlBreakdown = getTvlBreakdown(
      projectTvlValues[oldestTimestamp] ?? [],
    )

    const total =
      tvlBreakdown.native + tvlBreakdown.canonical + tvlBreakdown.external
    const oldTotal =
      oldTvlBreakdown.native +
      oldTvlBreakdown.canonical +
      oldTvlBreakdown.external

    const totalChange = oldTotal !== 0 ? (total - oldTotal) / oldTotal : 0

    return {
      tokenBreakdown: {
        total: breakdown.total / 100,
        ether: breakdown.ether / 100,
        stablecoin: breakdown.stablecoin / 100,
        associated: breakdown.associated / 100,
      },
      tvlBreakdown: {
        total: total / 100,
        native: tvlBreakdown.native / 100,
        canonical: tvlBreakdown.canonical / 100,
        external: tvlBreakdown.external / 100,
        totalChange,
      },
    }
  },
  ['tvlProjectStats'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)

function getMockTvlProjectStats(): TvlProjectStats {
  return {
    tokenBreakdown: {
      total: 100,
      ether: 80,
      stablecoin: 15,
      associated: 5,
    },
    tvlBreakdown: {
      total: 60,
      canonical: 30,
      native: 20,
      external: 10,
      totalChange: 0.25,
    },
  }
}
