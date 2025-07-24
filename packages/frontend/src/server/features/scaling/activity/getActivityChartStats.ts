import { getActivityChart } from './getActivityChart'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'

export type ActivityChartStats = {
  tps: {
    latestProjectsTxCount: number
    scalingFactor: number
  }
  uops: {
    latestProjectsTxCount: number
    scalingFactor: number
  }
}

export async function getActivityChartStats(
  filter: ActivityProjectFilter,
): Promise<ActivityChartStats> {
  // We should use the last 7 days but 30d is probably cached already so it's faster
  const { data: chartData } = await getActivityChart({
    filter,
    range: { type: '30d' },
  })

  const pointsWithData = chartData.filter(
    ([_, projectsTx, ethereumTx, projectsUops, ethereumUops]) => {
      return (
        projectsTx !== null &&
        ethereumTx !== null &&
        projectsUops !== null &&
        ethereumUops !== null
      )
    },
  ) as [number, number, number, number, number][]
  const latestData = pointsWithData.at(-1)
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
    (acc, [_, projectsTx, ethereumTx, projectsUops, ethereumUops]) => {
      acc.restTps = projectsTx !== null ? (acc.restTps ?? 0) + projectsTx : null
      acc.ethereumTps =
        ethereumTx !== null ? (acc.ethereumTps ?? 0) + ethereumTx : null
      acc.restUops =
        projectsUops !== null ? (acc.restUops ?? 0) + projectsUops : null
      acc.ethereumUops =
        ethereumUops !== null ? (acc.ethereumUops ?? 0) + ethereumUops : null
      return acc
    },
    {
      ethereumTps: null,
      restTps: null,
      ethereumUops: null,
      restUops: null,
    } as {
      ethereumTps: number | null
      restTps: number | null
      ethereumUops: number | null
      restUops: number | null
    },
  )

  return {
    tps: {
      latestProjectsTxCount: latestData[1],
      scalingFactor:
        totalTxs.ethereumTps === 0 ||
        totalTxs.restTps === null ||
        totalTxs.ethereumTps === null
          ? 0
          : (totalTxs.restTps + totalTxs.ethereumTps) / totalTxs.ethereumTps,
    },
    uops: {
      latestProjectsTxCount: latestData[3],
      scalingFactor:
        totalTxs.ethereumUops === 0 ||
        totalTxs.restUops === null ||
        totalTxs.ethereumUops === null
          ? 0
          : (totalTxs.restUops + totalTxs.ethereumUops) / totalTxs.ethereumUops,
    },
  }
}
