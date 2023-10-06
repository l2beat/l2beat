import { formatTimestamp } from '../../../../utils'
import { formatCurrency } from '../../../../utils/format'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { getEntriesByDays } from '../getEntriesByDays'
import { DetailedTvlData, renderDetailedTvlHover } from '../hovers'
import { ChartControlsState } from '../types'

export function getDetailedTvlRenderParams(
  state: ChartControlsState,
): RenderParams<DetailedTvlData> {
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
            usd,
            cbv,
            ebv,
            nmv,
            eth,
            cbvEth,
            ebvEth,
            nmvEth,
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
      },
      {
        line: 'pink',
        fill: 'pink',
      },
    ]

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: (data) =>
        renderDetailedTvlHover(data, !!state.useAltCurrency),
      useLogScale: state.useLogScale,
      range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
    }
  }
}
