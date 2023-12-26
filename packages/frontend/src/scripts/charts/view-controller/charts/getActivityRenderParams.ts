import { formatTimestamp } from '../../../../utils'
import { formatTpsWithUnit } from '../../../../utils/formatTps'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { getEntriesByDays } from '../getEntriesByDays'
import { ActivityData, renderActivityHover } from '../hovers'
import { ChartControlsState } from '../types'

export function getActivityRenderParams(
  state: ChartControlsState,
): RenderParams<ActivityData> {
  {
    if (state.data?.type !== 'activity') {
      throw new Error('Invalid data type')
    }

    const dataInRange = getEntriesByDays(
      state.timeRangeInDays,
      state.data.values,
    )
    const points = dataInRange.map(([timestamp, txs, ethTxs]) => {
      const tps = getTps(txs)
      const ethTps = getTps(ethTxs)
      return {
        series: state.showEthereumTransactions ? [ethTps, tps] : [tps],
        data: {
          date: formatTimestamp(timestamp, { withTime: true }),
          tps,
          ethTps,
        },
        milestone: state.milestones[timestamp],
      }
    })

    const formatYAxisLabel = (x: number) => formatTpsWithUnit(x)

    const tpsPoint = 'redCircle'
    const ethTpsPoint = 'blueSquare'

    const seriesStyle: SeriesStyle[] = [
      {
        line: 'signature gradient',
        fill: 'signature gradient',
        point: tpsPoint,
      },
    ]
    if (state.showEthereumTransactions) {
      seriesStyle.unshift({
        line: 'blue gradient',
        fill: 'blue gradient',
        point: ethTpsPoint,
      })
    }

    const isAggregate = state.data.isAggregate

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: (value) =>
        renderActivityHover(
          value,
          !!state.showEthereumTransactions,
          isAggregate,
        ),
      useLogScale: state.useLogScale,
      range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
    }
  }
}

function getTps(dailyTransactions: number) {
  return dailyTransactions / (60 * 60 * 24)
}
