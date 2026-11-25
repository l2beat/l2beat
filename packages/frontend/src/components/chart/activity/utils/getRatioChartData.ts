import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'

/** User operations per transaction: one each where there are none */
export function getUopsRatio(uops: number, txs: number) {
  return txs === 0 ? 1 : uops / txs
}

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
        ratio: getUopsRatio(projectsUops, projectsTx),
      }
    },
  )
}
