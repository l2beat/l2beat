import { getActivityChart } from './get-activity-chart'
import { type ActivityProjectFilter } from './utils/project-filter-utils'

export type ActivityChartStats = Awaited<
  ReturnType<typeof getActivityChartStats>
>
export async function getActivityChartStats(filter: ActivityProjectFilter) {
  // We should use the last 7 days but 30d is probably cached already so it's faster
  const chartData = await getActivityChart(filter, '30d')

  const latestData = chartData.result.at(-1)
  if (!latestData) {
    return {
      latestProjectsTxCount: 0,
      scalingFactor: 0,
    }
  }

  const totalTxs = chartData.result.slice(-7)?.reduce(
    (acc, curr) => {
      acc.ethereum += curr[2]
      acc.rest += curr[1]
      return acc
    },
    { ethereum: 0, rest: 0 },
  )

  return {
    latestProjectsTxCount: latestData[1],
    scalingFactor:
      totalTxs.ethereum === 0
        ? 0
        : (totalTxs.rest + totalTxs.ethereum) / totalTxs.ethereum,
  }
}
