import { type Database } from '@l2beat/database'
import { getActivityChart } from './get-activity-chart'
import { type ActivityProjectFilter } from './utils/project-filter-utils'

export type ActivityChartStats = Awaited<
  ReturnType<typeof getActivityChartStats>
>
export async function getActivityChartStats(
  db: Database,
  filter: ActivityProjectFilter,
) {
  // We should use the last 7 days but 30d is probably cached already so it's faster
  const { data: chartData } = await getActivityChart(db, filter, '30d')

  const latestData = chartData.at(-1)
  if (!latestData) {
    return {
      latestProjectsTxCount: 0,
      scalingFactor: 0,
    }
  }

  const totalTxs = chartData.slice(-7)?.reduce(
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
