import { bridges, layer2s, layer3s } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getTvlBreakdown } from './get-tvl-breakdown'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'

export function get7dTvlBreakdown(
  ...parameters: Parameters<typeof getCached7dTokenBreakdown>
) {
  if (env.MOCK) {
    return getMockTvlBreakdownData()
  }
  return getCached7dTokenBreakdown(...parameters)
}

export interface SevenDayTvlBreakdown {
  total: number
  projects: Record<string, ProjectSevenDayTvlBreakdown>
}

export interface ProjectSevenDayTvlBreakdown {
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
  async (): Promise<SevenDayTvlBreakdown> => {
    const tvlValues = await getTvlValuesForProjects(
      getTvlProjects(
        (project) => project.type === 'layer2' || project.type === 'layer3',
      ),
      '7d',
    )

    const projects = Object.fromEntries(
      Object.entries(tvlValues).map(
        ([projectId, values]): [string, ProjectSevenDayTvlBreakdown] => {
          const latestTimestamp = Math.max(...Object.keys(values).map(Number))
          const oldestTimestamp = Math.min(...Object.keys(values).map(Number))
          const latestValues = values[latestTimestamp] ?? []
          const oldestValues = values[oldestTimestamp] ?? []
          const breakdown = getTvlBreakdown(latestValues)
          const oldBreakdown = getTvlBreakdown(oldestValues)
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
    tags: ['tvl'],
    revalidate: UnixTime.DAY,
  },
)

function getMockTvlBreakdownData(): SevenDayTvlBreakdown {
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
