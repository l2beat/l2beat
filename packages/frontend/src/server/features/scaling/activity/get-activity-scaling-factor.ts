import { getActivityChart } from './get-activity-chart'
import { type ActivityProjectFilter } from './utils/project-filter-utils'

export async function getActivityScalingFactor(filter: ActivityProjectFilter) {
  // We should use the last 7 days but 30d is probably cached already so it's faster
  const chartData = await getActivityChart(filter, '30d')
  const totalTxs = chartData.slice(-7)?.reduce(
    (acc, curr) => {
      acc.ethereum += curr[2]
      acc.rest += curr[1]
      return acc
    },
    { ethereum: 0, rest: 0 },
  )

  if (totalTxs.ethereum === 0) {
    return 0
  }

  return (totalTxs.rest + totalTxs.ethereum) / totalTxs.ethereum
}
