import { formatTimestamp } from '../../../../utils'
import { formatCurrency } from '../../../../utils/format'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { getEntriesByDays } from '../getEntriesByDays'
import { renderTvlHover, TvlData } from '../hovers'
import { ChartControlsState } from '../types'

export function getTvlRenderParams(
  state: ChartControlsState,
): RenderParams<TvlData> {
  if (state.data?.type !== 'tvl') {
    throw new Error('Invalid data type')
  }

  const dataInRange = getEntriesByDays(
    state.timeRangeInDays,
    state.data.values,
    { trimLeft: true },
  )

  const points = dataInRange.map(([timestamp, usd, eth]) => ({
    series: [state.useAltCurrency ? eth : usd],
    data: {
      date: formatTimestamp(timestamp, true),
      usd,
      eth,
    },
    milestone: state.milestones[timestamp],
  }))

  const formatYAxisLabel = state.useAltCurrency
    ? (x: number) => formatCurrency(x, 'eth')
    : (x: number) => formatCurrency(x, 'usd')

  const seriesStyle: SeriesStyle[] = [
    {
      line: 'signature gradient',
      fill: 'signature gradient',
      point: 'circle',
    },
  ]

  return {
    formatYAxisLabel,
    points,
    seriesStyle,
    renderHoverContents: (data) => renderTvlHover(data, !!state.useAltCurrency),
    useLogScale: state.useLogScale,
    range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
  }
}
