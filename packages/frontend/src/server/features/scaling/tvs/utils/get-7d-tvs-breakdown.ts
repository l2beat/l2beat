import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getTvsBreakdown } from './get-tvs-breakdown'
import { getTvsProjects } from './get-tvs-projects'
import { getTvsValuesForProjects } from './get-tvs-values-for-projects'

export function get7dTvsBreakdown(
  ...parameters: Parameters<typeof getCached7dTokenBreakdown>
) {
  if (env.MOCK) {
    return getMockTvsBreakdownData()
  }
  return getCached7dTokenBreakdown(...parameters)
}

export interface SevenDayTvsBreakdown {
  total: number
  projects: Record<string, ProjectSevenDayTvsBreakdown>
}

export interface ProjectSevenDayTvsBreakdown {
  breakdown: BreakdownSplit & {
    ether: number
    stablecoin: number
  }
  associated: BreakdownSplit
  change: BreakdownSplit
  changeExcludingAssociated: BreakdownSplit
}

export interface BreakdownSplit {
  total: number
  canonical: number
  external: number
  native: number
}

export const TvsBreakdownProjectFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum(['all', 'layer2', 'bridge']),
  }),
  z.object({ type: z.literal('projects'), projectIds: z.array(z.string()) }),
])

type TvsBreakdownProjectFilter = z.infer<typeof TvsBreakdownProjectFilter>

const getCached7dTokenBreakdown = cache(
  async (props: TvsBreakdownProjectFilter): Promise<SevenDayTvsBreakdown> => {
    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )

    const tokens = await ps.getTokens()
    const tvsValues = await getTvsValuesForProjects(
      await getTvsProjects(
        createTvsBreakdownProjectFilter(props),
        chains,
        tokens,
      ),
      '7d',
    )

    const projects = Object.fromEntries(
      Object.entries(tvsValues).map(
        ([projectId, values]): [string, ProjectSevenDayTvsBreakdown] => {
          const latestTimestamp = Math.max(...Object.keys(values).map(Number))
          const oldestTimestamp = Math.min(...Object.keys(values).map(Number))
          const latestValues = values[latestTimestamp] ?? []
          const oldestValues = values[oldestTimestamp] ?? []
          const breakdown = getTvsBreakdown(latestValues)
          const oldBreakdown = getTvsBreakdown(oldestValues)
          const total =
            breakdown.native + breakdown.canonical + breakdown.external
          const oldTotal =
            oldBreakdown.native + oldBreakdown.canonical + oldBreakdown.external
          const associatedTotal =
            breakdown.associated.native +
            breakdown.associated.canonical +
            breakdown.associated.external
          const oldAssociatedTotal =
            oldBreakdown.associated.native +
            oldBreakdown.associated.canonical +
            oldBreakdown.associated.external
          return [
            projectId,
            {
              breakdown: {
                total: total / 100,
                native: breakdown.native / 100,
                canonical: breakdown.canonical / 100,
                external: breakdown.external / 100,
                ether: breakdown.ether / 100,
                stablecoin: breakdown.stablecoin / 100,
              },
              associated: {
                total: associatedTotal / 100,
                native: breakdown.associated.native / 100,
                canonical: breakdown.associated.canonical / 100,
                external: breakdown.associated.external / 100,
              },
              change: {
                total: calculatePercentageChange(total, oldTotal),
                native: calculatePercentageChange(
                  breakdown.native,
                  oldBreakdown.native,
                ),
                canonical: calculatePercentageChange(
                  breakdown.canonical,
                  oldBreakdown.canonical,
                ),
                external: calculatePercentageChange(
                  breakdown.external,
                  oldBreakdown.external,
                ),
              },
              changeExcludingAssociated: {
                total: calculatePercentageChange(
                  total - associatedTotal,
                  oldTotal - oldAssociatedTotal,
                ),
                native: calculatePercentageChange(
                  breakdown.native - breakdown.associated.native,
                  oldBreakdown.native - oldBreakdown.associated.native,
                ),
                canonical: calculatePercentageChange(
                  breakdown.canonical - breakdown.associated.canonical,
                  oldBreakdown.canonical - oldBreakdown.associated.canonical,
                ),
                external: calculatePercentageChange(
                  breakdown.external - breakdown.associated.external,
                  oldBreakdown.external - oldBreakdown.associated.external,
                ),
              },
            },
          ]
        },
      ),
    )

    const total = Object.values(projects).reduce(
      (acc, { breakdown }) =>
        acc + breakdown.native + breakdown.canonical + breakdown.external,
      0,
    )

    return {
      total,
      projects,
    }
  },
  ['getCached7dTokenBreakdown'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function createTvsBreakdownProjectFilter(
  filter: TvsBreakdownProjectFilter,
): (project: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean {
  switch (filter.type) {
    case 'projects':
      return (project) => filter.projectIds.includes(project.id)
    case 'all':
      return () => true
    case 'layer2':
      return (project) => !!project.scalingInfo
    case 'bridge':
      return (project) => !!project.isBridge
  }
}
async function getMockTvsBreakdownData(): Promise<SevenDayTvsBreakdown> {
  const projects = await ps.getProjects({ where: ['tvlConfig'] })
  return {
    total: 1000,
    projects: Object.fromEntries(
      projects.map((project) => [
        project.id,
        {
          breakdown: {
            total: 60,
            canonical: 30,
            native: 20,
            external: 10,
            ether: 30,
            stablecoin: 30,
          },
          associated: {
            total: 6,
            native: 1,
            canonical: 2,
            external: 3,
          },
          change: {
            total: 0.4,
            canonical: 0.5,
            native: 0.25,
            external: 0.25,
          },
          changeExcludingAssociated: {
            total: 0.3,
            canonical: 0.4,
            native: 0.15,
            external: 0.15,
          },
        },
      ]),
    ),
  }
}
