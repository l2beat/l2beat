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
    if (state.unit === 'GAS') {
      throw new Error('Invalid unit')
    }

    const dataInRange = getEntriesByDays(
      state.timeRangeInDays,
      state.data.values,
      { trimLeft: true },
    )
    const useEth = state.unit === 'ETH'

    const points = dataInRange.map(
      ([
        timestamp,
        totalUsd,
        canonicalUsd,
        externalUsd,
        nativeUsd,
        totalEth,
        canonicalEth,
        externalEth,
        nativeEth,
      ]) => {
        return {
          series: useEth
            ? [
                { value: canonicalEth + externalEth + nativeEth },
                { value: externalEth + nativeEth },
                { value: nativeEth },
              ]
            : [
                { value: canonicalUsd + externalUsd + nativeUsd },
                { value: externalUsd + nativeUsd },
                { value: nativeUsd },
              ],
          data: {
            date: formatTimestamp(timestamp, { mode: 'datetime' }),
            totalUsd,
            canonicalUsd,
            externalUsd,
            nativeUsd,
            totalEth,
            canonicalEth,
            externalEth,
            nativeEth,
          },
          milestone: state.milestones[timestamp],
        }
      },
    )

    const formatYAxisLabel = (value: number) =>
      formatCurrency(value, state.unit, { showLessThanMinimum: false })

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
      renderHoverContents: (data) => renderDetailedTvlHover(data, useEth),
      useLogScale: state.useLogScale,
      range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
      theme: state.theme,
    }
  }
}
