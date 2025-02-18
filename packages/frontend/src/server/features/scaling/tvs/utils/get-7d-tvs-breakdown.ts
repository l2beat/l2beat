import { bridges, layer2s, layer3s } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
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
  breakdown: BreakdownSplit
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

const getCached7dTokenBreakdown = cache(
  async ({
    type,
  }: { type: 'layer2' | 'bridge' | 'all' }): Promise<SevenDayTvsBreakdown> => {
    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )
    const tvsValues = await getTvsValuesForProjects(
      getTvsProjects(
        (project) =>
          type === 'all'
            ? true
            : type === 'layer2'
              ? project.type === 'layer2' || project.type === 'layer3'
              : project.type === 'bridge',
        chains,
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

function getMockTvsBreakdownData(): SevenDayTvsBreakdown {
  return {
    total: 1000,
    projects: Object.fromEntries(
      [...layer2s, ...layer3s, ...bridges].map((project) => [
        project.id,
        {
          breakdown: {
            total: 60,
            canonical: 30,
            native: 20,
            external: 10,
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
