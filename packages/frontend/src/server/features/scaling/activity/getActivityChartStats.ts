import { optionToRange } from '~/utils/range/range'
import { getRecategorisedActivityChart } from './getRecategorisedActivityChart'
import { countPerSecond } from './utils/countPerSecond'
import type { ActivityProjectFilter } from './utils/projectFilterUtils'

export type ActivityChartStats = {
  uops: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
    ethereum: number
    scalingFactor: number
  }
  tps: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
    ethereum: number
    scalingFactor: number
  }
}

export async function getActivityChartStats(
  filter: ActivityProjectFilter,
): Promise<ActivityChartStats> {
  const { data: chartData } = await getRecategorisedActivityChart(
    filter,
    optionToRange('30d'),
  )

  const latestData = chartData.at(-1)
  if (!latestData) {
    return {
      uops: {
        rollups: 0,
        validiumsAndOptimiums: 0,
        others: 0,
        ethereum: 0,
        scalingFactor: 0,
      },
      tps: {
        rollups: 0,
        validiumsAndOptimiums: 0,
        others: 0,
        ethereum: 0,
        scalingFactor: 0,
      },
    }
  }

  const totalTxs = chartData.slice(-7)?.reduce(
    (acc, dataPoint) => {
      const rollupsTps = dataPoint[5]
      const rollupsUops = dataPoint[1]
      const ethereumTps = dataPoint[8]
      const ethereumUops = dataPoint[4]

      acc.rollupsTps =
        rollupsTps !== null ? (acc.rollupsTps ?? 0) + rollupsTps : null
      acc.ethereumTps =
        ethereumTps !== null ? (acc.ethereumTps ?? 0) + ethereumTps : null
      acc.rollupsUops =
        rollupsUops !== null ? (acc.rollupsUops ?? 0) + rollupsUops : null
      acc.ethereumUops =
        ethereumUops !== null ? (acc.ethereumUops ?? 0) + ethereumUops : null
      return acc
    },
    {
      ethereumTps: null,
      rollupsTps: null,
      ethereumUops: null,
      rollupsUops: null,
    } as {
      ethereumTps: number | null
      rollupsTps: number | null
      ethereumUops: number | null
      rollupsUops: number | null
    },
  )

  const [
    _,
    rollupsUops,
    validiumsAndOptimiumsUops,
    othersUops,
    ethereumUops,
    rollupsTx,
    validiumsAndOptimiumsTx,
    othersTx,
    ethereumTx,
  ] = latestData

  return {
    uops: {
      rollups: rollupsUops ? countPerSecond(rollupsUops) : 0,
      validiumsAndOptimiums: validiumsAndOptimiumsUops
        ? countPerSecond(validiumsAndOptimiumsUops)
        : 0,
      others: othersUops ? countPerSecond(othersUops) : 0,
      ethereum: ethereumUops ? countPerSecond(ethereumUops) : 0,
      scalingFactor:
        totalTxs.ethereumUops === 0 ||
        totalTxs.rollupsUops === null ||
        totalTxs.ethereumUops === null
          ? 0
          : (totalTxs.rollupsUops + totalTxs.ethereumUops) /
            totalTxs.ethereumUops,
    },
    tps: {
      rollups: rollupsTx ? countPerSecond(rollupsTx) : 0,
      validiumsAndOptimiums: validiumsAndOptimiumsTx
        ? countPerSecond(validiumsAndOptimiumsTx)
        : 0,
      others: othersTx ? countPerSecond(othersTx) : 0,
      ethereum: ethereumTx ? countPerSecond(ethereumTx) : 0,
      scalingFactor:
        totalTxs.ethereumTps === 0 ||
        totalTxs.rollupsTps === null ||
        totalTxs.ethereumTps === null
          ? 0
          : (totalTxs.rollupsTps + totalTxs.ethereumTps) / totalTxs.ethereumTps,
    },
  }
}
