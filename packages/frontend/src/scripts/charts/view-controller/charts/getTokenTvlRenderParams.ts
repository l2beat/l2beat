import { formatLargeNumber, formatTimestamp } from '../../../../utils'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { getEntriesByDays } from '../getEntriesByDays'
import { ChartControlsState } from '../types'

export function getTokenTvlRenderParams(
  state: ChartControlsState,
): RenderParams<{ date: string; token: number; usd: number }> {
  {
    if (state.data?.type !== 'token-tvl') {
      throw new Error('Invalid data type')
    }

    const dataInRange = getEntriesByDays(
      state.timeRangeInDays,
      state.data.values,
    )

    const points = dataInRange.map(([timestamp, token, usd]) => {
      return {
        series: [token],
        data: {
          date: formatTimestamp(timestamp, true),
          token,
          usd,
        },
        milestone: state.milestones[timestamp],
      }
    })

    const formatYAxisLabel = (val: number) => formatLargeNumber(val)

    const seriesStyle: SeriesStyle[] = [tokenTypeToStyle(state.tokenType)]

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: () => '',
      useLogScale: state.useLogScale,
    }
  }
}

function tokenTypeToStyle(tokenType: 'CBV' | 'EBV' | 'NMV'): SeriesStyle {
  switch (tokenType) {
    case 'CBV':
      return {
        line: 'purple',
        fill: 'purple',
        point: 'circle',
      }
    case 'EBV':
      return {
        line: 'yellow',
        fill: 'yellow',
        point: 'circle',
      }
    case 'NMV':
      return {
        line: 'pink',
        fill: 'pink',
        point: 'circle',
      }
  }
}
