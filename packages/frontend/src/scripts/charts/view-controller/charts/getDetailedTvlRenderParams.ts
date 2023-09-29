import { formatCurrency } from '../../../../components/chart/configure/update/view/format'
import { formatTimestamp } from '../../../../utils'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { getEntriesByDays } from '../getEntriesByDays'
import { ChartControlsState } from '../types'

export function getDetailedTvlRenderParams(
  state: ChartControlsState,
): RenderParams<{ date: string; eth: number; usd: number }> {
  {
    if (state.data?.type !== 'detailed-tvl') {
      throw new Error('Invalid data type')
    }

    const dataInRange = getEntriesByDays(
      state.timeRangeInDays,
      state.data.values,
      { trimLeft: true },
    )

    const points = dataInRange.map(
      ([timestamp, usd, cbv, ebv, nmv, eth, cbvEth, ebvEth, nmvEth]) => {
        return {
          series: state.useAltCurrency
            ? [cbvEth + ebvEth + nmvEth, ebvEth + nmvEth, nmvEth]
            : [cbv + ebv + nmv, ebv + nmv, nmv],
          data: {
            date: formatTimestamp(timestamp, true),
            eth,
            usd,
          },
          milestone: state.milestones[timestamp],
        }
      },
    )

    const formatYAxisLabel = (val: number) =>
      formatCurrency(val, state.useAltCurrency ? 'eth' : 'usd')

    const seriesStyle: SeriesStyle[] = [
      {
        line: 'purple',
        fill: 'purple',
        point: 'circle',
      },
      {
        line: 'yellow',
        fill: 'yellow',
        point: 'circle',
      },
      {
        line: 'pink',
        fill: 'pink',
        point: 'circle',
      },
    ]

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: () => '',
      useLogScale: state.useLogScale,
    }
  }
}
