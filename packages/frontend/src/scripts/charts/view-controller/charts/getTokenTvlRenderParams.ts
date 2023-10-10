import { formatLargeNumber, formatTimestamp } from '../../../../utils'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { TokenInfo } from '../../types'
import { getEntriesByDays } from '../getEntriesByDays'
import { renderTokenTvlHover } from '../hovers'
import { ChartControlsState } from '../types'

export function getTokenTvlRenderParams(
  state: ChartControlsState,
): RenderParams<{ date: string; token: number; usd: number }> {
  {
    if (state.data?.type !== 'token-tvl') {
      throw new Error('Invalid data type')
    }
    const { tokenSymbol, tokenType } = state.data

    const dataInRange = getEntriesByDays(
      state.timeRangeInDays,
      state.data.values,
      {
        trimLeft: true,
      },
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

    const formatYAxisLabel = (val: number) =>
      `${formatLargeNumber(val)} ${tokenSymbol}`

    const seriesStyle: SeriesStyle[] = [tokenTypeToStyle(tokenType)]

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: (data) =>
        renderTokenTvlHover(data, tokenSymbol, tokenType),
      useLogScale: state.useLogScale,
      range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
    }
  }
}

function tokenTypeToStyle(tokenType: TokenInfo['type']): SeriesStyle {
  switch (tokenType) {
    case 'regular': {
      return {
        line: 'signature gradient',
        fill: 'signature gradient',
        point: 'circle',
      }
    }
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
