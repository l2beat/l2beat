import { assert } from '@l2beat/backend-tools'
import { type ValueRecord } from '@l2beat/database'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getEthPrices } from './get-eth-prices'
import { type TvlProject, getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import { type TvlChartRange } from './range-utils'
import { sumValuesPerSource } from './sum-values-per-source'

export async function getScalingSummaryData(
  ...args: Parameters<typeof getCachedScalingSummaryData>
) {
  noStore()
  return getCachedScalingSummaryData(...args)
}

export const getCachedScalingSummaryData = cache(
  async ({
    range,
    excludeAssociatedTokens,
    ...rest
  }: { range: TvlChartRange; excludeAssociatedTokens?: boolean } & (
    | { type: 'layer2' }
    | { type: 'projects'; projectIds: string[] }
  )) => {
    const projectsFilter = (() => {
      if (rest.type === 'layer2') {
        return (project: TvlProject) =>
          ['layer2', 'layer3'].includes(project.type)
      }

      const projectIds = new Set(rest.projectIds)
      return (project: TvlProject) => projectIds.has(project.id)
    })()

    const tvlProjects = getTvlProjects().filter(projectsFilter)
    const ethPrices = await getEthPrices()

    const values = await getTvlValuesForProjects(tvlProjects, range)

    const timestampValues: Record<string, ValueRecord[]> = {}

    for (const projectValues of Object.values(values)) {
      for (const [timestamp, values] of Object.entries(projectValues)) {
        const map = timestampValues[timestamp] ?? []
        timestampValues[timestamp] = map.concat(values)
      }
    }

    const chart = Object.entries(timestampValues).map(([timestamp, values]) => {
      const summed = sumValuesPerSource(values, {
        forTotal: true,
        excludeAssociatedTokens: !!excludeAssociatedTokens,
      })
      return [
        +timestamp,
        Number(summed.native),
        Number(summed.canonical),
        Number(summed.external),
        ethPrices[+timestamp]! * 100,
      ] as const
    })

    const projects = Object.fromEntries(
      Object.entries(values).map(([projectId, values]) => {
        const timestamps = Object.keys(values)
        const oldestTimestamp = timestamps.reduce(
          (acc, curr) => (+curr < acc ? +curr : acc),
          Infinity,
        )
        const newestTimestamp = timestamps.reduce(
          (acc, curr) => (+curr > acc ? +curr : acc),
          -Infinity,
        )
        assert(
          values[oldestTimestamp] && values[newestTimestamp],
          "Values don't exist",
        )
        const oldest = sumValuesPerSource(values[oldestTimestamp], {
          forTotal: false,
          excludeAssociatedTokens: true,
        })
        const latest = sumValuesPerSource(values[newestTimestamp], {
          forTotal: false,
          excludeAssociatedTokens: true,
        })
        const breakdown = getBreakdown(values[newestTimestamp])
        return [
          projectId,
          {
            timestamp: newestTimestamp,
            latest: {
              native: Number(latest.native),
              canonical: Number(latest.canonical),
              external: Number(latest.external),
            },
            change:
              Number(latest.canonical + latest.external + latest.native) /
                Number(oldest.canonical + oldest.external + oldest.native) -
              1,
            breakdown: {
              total: Number(breakdown.total),
              associated: Number(breakdown.associated),
              ether: Number(breakdown.ether),
              stablecoin: Number(breakdown.stablecoin),
            },
          },
        ]
      }),
    )

    return { chart, projects }
  },
  ['getScalingSummaryData'],
  { revalidate: 60 * 10 },
)

export type ScalingSummaryData = Awaited<
  ReturnType<typeof getCachedScalingSummaryData>
>

function getBreakdown(values: ValueRecord[]) {
  return values.reduce(
    (acc, curr) => {
      acc.total += curr.native + curr.canonical + curr.external
      acc.ether += curr.ether
      acc.stablecoin += curr.stablecoin
      acc.associated +=
        curr.nativeAssociated +
        curr.canonicalAssociated +
        curr.externalAssociated
      return acc
    },
    {
      total: 0n,
      associated: 0n,
      ether: 0n,
      stablecoin: 0n,
    },
  )
}
