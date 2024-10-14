import { bridges, layer2s, layer3s } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { getTokenBreakdown } from './get-token-breakdown'
import { type BaseProject, getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'

export function get7dTokenBreakdown(
  ...parameters: Parameters<typeof getCached7dTokenBreakdown>
) {
  if (env.MOCK) {
    return getMock7dTokenBreakdown()
  }
  noStore()
  return getCached7dTokenBreakdown(...parameters)
}

export type LatestTvl = Awaited<ReturnType<typeof getCached7dTokenBreakdown>>
export const getCached7dTokenBreakdown = cache(
  async ({ type }: { type: 'layer2' | 'bridge' }) => {
    const filter =
      type === 'layer2'
        ? (project: BaseProject) =>
            project.type === 'layer2' || project.type === 'layer3'
        : (project: BaseProject) => project.type === 'bridge'

    const projectsToQuery = getTvlProjects(filter)

    const tvlValues = await getTvlValuesForProjects(projectsToQuery, '7d')

    const projects = Object.fromEntries(
      Object.entries(tvlValues).map(([projectId, values]) => {
        const latestTimestamp = Math.max(...Object.keys(values).map(Number))
        const oldestTimestamp = Math.min(...Object.keys(values).map(Number))
        const latestValues = values[latestTimestamp] ?? []
        const oldestValues = values[oldestTimestamp] ?? []
        const breakdown = getTokenBreakdown(latestValues)
        const oldBreakdown = getTokenBreakdown(oldestValues)
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
  ['get7dTokenBreakdown'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)

function getMock7dTokenBreakdown(): LatestTvl {
  return {
    total: 1000,
    projects: Object.fromEntries(
      [...layer2s, ...layer3s, ...bridges].map((project) => [
        project.id,
        {
          breakdown: {
            total: 100,
            ether: 80,
            stablecoin: 15,
            associated: 5,
          },
          change: Math.random(),
        },
      ]),
    ),
  }
}
