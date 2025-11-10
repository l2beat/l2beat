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
  const { data: chartData } = await getRecategorisedActivityChart(filter, '30d')

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
        rollupsUops && ethereumUops ? rollupsUops / ethereumUops : 0,
    },
    tps: {
      rollups: rollupsTx ? countPerSecond(rollupsTx) : 0,
      validiumsAndOptimiums: validiumsAndOptimiumsTx
        ? countPerSecond(validiumsAndOptimiumsTx)
        : 0,
      others: othersTx ? countPerSecond(othersTx) : 0,
      ethereum: ethereumTx ? countPerSecond(ethereumTx) : 0,
      scalingFactor: rollupsTx && ethereumTx ? rollupsTx / ethereumTx : 0,
    },
  }
}
