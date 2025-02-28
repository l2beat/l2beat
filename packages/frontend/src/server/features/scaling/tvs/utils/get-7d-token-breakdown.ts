import { env } from '~/env'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getTokenBreakdown } from './get-token-breakdown'
import { getTvsProjects } from './get-tvs-projects'
import { getTvsValuesForProjects } from './get-tvs-values-for-projects'

export function get7dTokenBreakdown(
  ...parameters: Parameters<typeof get7dTokenBreakdownData>
) {
  if (env.MOCK) {
    return getMock7dTokenBreakdownData()
  }
  return get7dTokenBreakdownData(...parameters)
}

export type LatestTvs = Awaited<ReturnType<typeof get7dTokenBreakdownData>>
export async function get7dTokenBreakdownData({
  type,
}: { type: 'layer2' | 'bridge' | 'all' }) {
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const projectsToQuery = await getTvsProjects(
    (project) =>
      type === 'all'
        ? true
        : type === 'layer2'
          ? !!project.scalingInfo
          : !!project.isBridge,
    chains,
  )

  const tvsValues = await getTvsValuesForProjects(projectsToQuery, '7d')

  const projects = Object.fromEntries(
    Object.entries(tvsValues).map(([projectId, values]) => {
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
          change: calculatePercentageChange(
            breakdown.total,
            oldBreakdown.total,
          ),
          associatedTokensExcludedChange: calculatePercentageChange(
            breakdown.total - breakdown.associated,
            oldBreakdown.total - oldBreakdown.associated,
          ),
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
}

async function getMock7dTokenBreakdownData(): Promise<LatestTvs> {
  const projects = await ps.getProjects({ where: ['tvlConfig'] })
  return {
    total: 1000,
    projects: Object.fromEntries(
      projects.map((project) => [
        project.id,
        {
          breakdown: {
            total: 100,
            ether: 80,
            stablecoin: 15,
            associated: 5,
          },
          associatedTokensExcludedChange: Math.random(),
          change: Math.random(),
        },
      ]),
    ),
  }
}
