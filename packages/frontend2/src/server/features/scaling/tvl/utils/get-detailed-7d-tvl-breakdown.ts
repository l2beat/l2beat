import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getDetailedTvlBreakdown } from './get-detailed-tvl-breakdown'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'

export function getDetailed7dTvlBreakdown(
  ...parameters: Parameters<typeof getCachedDetailed7dTvlBreakdown>
) {
  noStore()
  return getCachedDetailed7dTvlBreakdown(...parameters)
}

export const getCachedDetailed7dTvlBreakdown = cache(
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
        const breakdown = getDetailedTvlBreakdown(latestValues)
        const oldBreakdown = getDetailedTvlBreakdown(oldestValues)
        const total =
          breakdown.native + breakdown.canonical + breakdown.external
        const oldTotal =
          oldBreakdown.native + oldBreakdown.canonical + oldBreakdown.external
        return [
          projectId,
          {
            total: total / 100,
            totalChange: (total - oldTotal) / total,
            breakdown: {
              native: breakdown.native / 100,
              canonical: breakdown.canonical / 100,
              external: breakdown.external / 100,
              associated: {
                native: breakdown.associated.native / 100,
                canonical: breakdown.associated.canonical / 100,
                external: breakdown.associated.external / 100,
              },
            },
            change: {
              native:
                (breakdown.native - oldBreakdown.native) / breakdown.native,
              canonical:
                (breakdown.canonical - oldBreakdown.canonical) /
                breakdown.canonical,
              external:
                (breakdown.external - oldBreakdown.external) /
                breakdown.external,
            },
          },
        ]
      }),
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
  ['getCachedDetailed7dTvlBreakdown'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)

export type DetailedLatestTvl = Awaited<
  ReturnType<typeof getCachedDetailed7dTvlBreakdown>
>
