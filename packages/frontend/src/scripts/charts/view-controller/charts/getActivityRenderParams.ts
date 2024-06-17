import { assert } from '@l2beat/shared-pure'
import { formatTimestamp } from '../../../../utils'
import { formatTpsWithUnit } from '../../../../utils/formatTps'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { getEntriesByDays } from '../getEntriesByDays'
import { ActivityData, renderActivityHover } from '../hovers'
import { ChartControlsState } from '../types'

const ESTIMATED_IMPACT_THRESHOLD = 0.1

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
      assert(state.data?.type === 'activity', 'Invalid data type')
      const isOutOfSync =
        !!state.data.values.estimatedImpact &&
        !!state.data.values.estimatedSince &&
        state.data.values.estimatedImpact > ESTIMATED_IMPACT_THRESHOLD &&
        timestamp > state.data.values.estimatedSince

      return {
        series: state.showEthereumTransactions
          ? [{ value: ethTps }, { value: tps, dashed: isOutOfSync }]
          : [{ value: tps, dashed: isOutOfSync }],
        data: {
          date: formatTimestamp(timestamp, { mode: 'datetime' }),
          tps,
          ethTps,
          isOutOfSync,
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
      theme: state.theme,
    }
  }
}

function getTps(dailyTransactions: number) {
  return dailyTransactions / (60 * 60 * 24)
}
