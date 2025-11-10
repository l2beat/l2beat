import type { RecategorisedActivityChartData } from '~/server/features/scaling/activity/getRecategorisedActivityChart'

export function getRatioChartData(
  data: RecategorisedActivityChartData | undefined,
) {
  return data?.data.map(
    ([
      timestamp,
      rollupsUopsCount,
      validiumsAndOptimiumsUopsCount,
      othersUopsCount,
      ethereumUopsCount,
      rollupsTxCount,
      validiumsAndOptimiumsTxCount,
      othersTxCount,
      ethereumTxCount,
    ]) => {
      const projectsUops =
        (rollupsUopsCount ?? 0) +
        (validiumsAndOptimiumsUopsCount ?? 0) +
        (othersUopsCount ?? 0) +
        (ethereumUopsCount ?? 0)

      const projectsTx =
        (rollupsTxCount ?? 0) +
        (validiumsAndOptimiumsTxCount ?? 0) +
        (othersTxCount ?? 0) +
        (ethereumTxCount ?? 0)

      return {
        timestamp,
        ratio: projectsTx === 0 ? 1 : projectsUops / projectsTx,
      }
    },
  )
}
