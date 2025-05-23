import type { Project } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import pick from 'lodash/pick'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getTvsProjects } from './utils/get-tvs-projects'
import { getTvsTargetTimestamp } from './utils/get-tvs-target-timestamp'

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
    const db = getDb()
    const target = getTvsTargetTimestamp()

    const [tvsProjects, values] = await Promise.all([
      getTvsProjects(createTvsBreakdownProjectFilter(props)),
      db.tvsProjectValue.getProjectValuesAtTimestamps(
        target - 7 * UnixTime.DAY,
        target,
        ['PROJECT', 'PROJECT_WA'],
      ),
    ])

    const valuesByProject = pick(
      groupBy(values, (v) => v.project),
      tvsProjects.map((p) => p.projectId),
    )

    const projects = Object.fromEntries(
      Object.entries(valuesByProject).map(
        ([projectId, projectValues]): [string, ProjectSevenDayTvsBreakdown] => {
          const [projectValuesAll, projectValuesWithoutAssociated] = partition(
            projectValues,
            (v) => v.type === 'PROJECT',
          )

          const latestWithoutAssociated = projectValuesWithoutAssociated.at(-1)
          const oldestWithoutAssociated = projectValuesWithoutAssociated.at(0)
          const latestValue = projectValuesAll.at(-1)
          const oldestValue = projectValuesAll.at(0)

          assert(
            latestValue &&
              oldestValue &&
              latestWithoutAssociated &&
              oldestWithoutAssociated,
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
                native: latestValue.native - latestWithoutAssociated.native,
                canonical:
                  latestValue.canonical - latestWithoutAssociated.canonical,
                external:
                  latestValue.external - latestWithoutAssociated.external,
              },
              change: {
                total: calculatePercentageChange(
                  latestValue.value,
                  oldestValue.value,
                ),
                native: calculatePercentageChange(
                  latestValue.native,
                  oldestValue.native,
                ),
                canonical: calculatePercentageChange(
                  latestValue.canonical,
                  oldestValue.canonical,
                ),
                external: calculatePercentageChange(
                  latestValue.external,
                  oldestValue.external,
                ),
              },
              changeExcludingAssociated: {
                total: calculatePercentageChange(
                  latestWithoutAssociated.value,
                  oldestWithoutAssociated.value,
                ),
                native: calculatePercentageChange(
                  latestWithoutAssociated.native,
                  oldestWithoutAssociated.native,
                ),
                canonical: calculatePercentageChange(
                  latestWithoutAssociated.canonical,
                  oldestWithoutAssociated.canonical,
                ),
                external: calculatePercentageChange(
                  latestWithoutAssociated.external,
                  oldestWithoutAssociated.external,
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
  const projects = await ps.getProjects({ where: ['tvsConfig'] })
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
