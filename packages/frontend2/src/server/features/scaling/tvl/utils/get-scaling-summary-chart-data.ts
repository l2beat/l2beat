import { type ValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { getEthPrices } from './get-eth-prices'
import { type TvlProject, getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import { type TvlChartRange } from './range'
import { sumValuesPerSource } from './sum-values-per-source'

export async function getScalingSummaryChartData(
  ...args: Parameters<typeof getCachedScalingChartData>
) {
  noStore()
  return getCachedScalingChartData(...args)
}

type CommonOptions = {
  range: TvlChartRange
  excludeAssociatedTokens?: boolean
}

type DataType =
  | {
      type: 'layer2'
    }
  | {
      type: 'projects'
      projectIds: string[]
    }

export const getCachedScalingChartData = cache(
  async ({
    range,
    excludeAssociatedTokens,
    ...rest
  }: CommonOptions & DataType) => {
    const projectsFilter = (() => {
      if (rest.type === 'layer2') {
        return (project: TvlProject) =>
          project.type === 'layer2' || project.type === 'layer3'
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

    return chart
  },
  ['getScalingSummaryChartData'],
  { revalidate: 10 * UnixTime.MINUTE },
)

export type ScalingSummaryData = Awaited<
  ReturnType<typeof getCachedScalingChartData>
>
