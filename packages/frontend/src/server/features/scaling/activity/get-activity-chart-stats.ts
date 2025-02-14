import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { getActivityChart } from './get-activity-chart'
import type { ActivityProjectFilter } from './utils/project-filter-utils'

export type ActivityChartStats = Awaited<
  ReturnType<typeof getCachedActivityChartStats>
>

export async function getActivityChartStats(
  filter: ActivityProjectFilter,
  previewRecategorisation: boolean,
) {
  return getCachedActivityChartStats(filter, previewRecategorisation)
}

export const getCachedActivityChartStats = cache(
  async (filter: ActivityProjectFilter, previewRecategorisation: boolean) => {
    // We should use the last 7 days but 30d is probably cached already so it's faster
    const { data: chartData } = await getActivityChart(
      filter,
      '30d',
      previewRecategorisation,
    )

    const latestData = chartData.at(-1)
    if (!latestData) {
      return {
        tps: {
          latestProjectsTxCount: 0,
          scalingFactor: 0,
        },
        uops: {
          latestProjectsTxCount: 0,
          scalingFactor: 0,
        },
      }
    }

    const totalTxs = chartData.slice(-7)?.reduce(
      (acc, curr) => {
        acc.restTps += curr[1]
        acc.ethereumTps += curr[2]
        acc.restUops += curr[3]
        acc.ethereumUops += curr[4]
        return acc
      },
      { ethereumTps: 0, restTps: 0, ethereumUops: 0, restUops: 0 },
    )

    return {
      tps: {
        latestProjectsTxCount: latestData[1],
        scalingFactor:
          totalTxs.ethereumTps === 0
            ? 0
            : (totalTxs.restTps + totalTxs.ethereumTps) / totalTxs.ethereumTps,
      },
      uops: {
        latestProjectsTxCount: latestData[3],
        scalingFactor:
          totalTxs.ethereumUops === 0
            ? 0
            : (totalTxs.restUops + totalTxs.ethereumUops) /
              totalTxs.ethereumUops,
      },
    }
  },
  ['activity-chart-stats'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
