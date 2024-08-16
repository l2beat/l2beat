import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getTvlBreakdown } from './get-tvl-breakdown'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'

export function get7dTvlBreakdown(
  ...parameters: Parameters<typeof getCached7dTvlBreakdown>
) {
  noStore()
  return getCached7dTvlBreakdown(...parameters)
}

export const getCached7dTvlBreakdown = cache(
  async () => {
    const tvlValues = await getTvlValuesForProjects(
      getTvlProjects().filter(
        (project) => project.type === 'layer2' || project.type === 'layer3',
      ),
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
              total: breakdown.total / 100,
              ether: breakdown.ether / 100,
              stablecoin: breakdown.stablecoin / 100,
              associated: breakdown.associated / 100,
            },
            change: (breakdown.total - oldBreakdown.total) / breakdown.total,
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
      projects,
    }
  },
  ['get7dTvlBreakdown'],
  {
    revalidate: 60 * 10,
  },
)

export type LatestTvl = Awaited<ReturnType<typeof getCached7dTvlBreakdown>>
