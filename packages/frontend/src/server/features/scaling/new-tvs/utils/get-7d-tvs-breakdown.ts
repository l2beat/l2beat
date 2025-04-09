import type { Project } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
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
    const tvsValues = await getTvsValuesForProjects(
      await getTvsProjects(createTvsBreakdownProjectFilter(props)),
      '7d',
      'FULL',
    )

    const projects = Object.fromEntries(
      Object.entries(tvsValues).map(
        ([projectId, values]): [string, ProjectSevenDayTvsBreakdown] => {
          const latestTimestamp = Math.max(...Object.keys(values).map(Number))
          const oldestTimestamp = Math.min(...Object.keys(values).map(Number))
          const latestValue = values[latestTimestamp]
          const oldestValues = values[oldestTimestamp]

          assert(
            latestValue && oldestValues,
            `No values for project ${projectId}`,
          )

          return [
            projectId,
            {
              breakdown: {
                total: latestValue.value,
                native: latestValue.native,
                canonical: latestValue.canonical,
                external: latestValue.external,
                ether: latestValue.ether,
                stablecoin: latestValue.stablecoin,
              },
              associated: {
                total: latestValue.associated,
                native: latestValue.associated / 3,
                canonical: latestValue.associated / 3,
                external: latestValue.associated / 3,
              },
              change: {
                total: calculatePercentageChange(
                  latestValue.value,
                  oldestValues.value,
                ),
                native: calculatePercentageChange(
                  latestValue.native,
                  oldestValues.native,
                ),
                canonical: calculatePercentageChange(
                  latestValue.canonical,
                  oldestValues.canonical,
                ),
                external: calculatePercentageChange(
                  latestValue.external,
                  oldestValues.external,
                ),
              },
              changeExcludingAssociated: {
                total: calculatePercentageChange(
                  latestValue.associated,
                  oldestValues.associated,
                ),
                native: calculatePercentageChange(
                  latestValue.native - latestValue.associated / 3,
                  oldestValues.native - oldestValues.associated / 3,
                ),
                canonical: calculatePercentageChange(
                  latestValue.canonical - latestValue.associated / 3,
                  oldestValues.canonical - oldestValues.associated / 3,
                ),
                external: calculatePercentageChange(
                  latestValue.external - latestValue.associated / 3,
                  oldestValues.external - oldestValues.associated / 3,
                ),
              },
            },
          ]
        },
      ),
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
  ['getCached7dTokenBreakdown-new'],
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
