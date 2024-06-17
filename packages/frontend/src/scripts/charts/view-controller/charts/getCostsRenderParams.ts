import { formatNumber, formatTimestamp } from '../../../../utils'
import { formatCurrency } from '../../../../utils/format'
import { RenderParams } from '../../renderer/ChartRenderer'
import { SeriesStyle } from '../../styles'
import { CostsChart } from '../../types'
import { getEntriesByDays } from '../getEntriesByDays'
import { CostsData, renderCostsHover } from '../hovers'
import { ChartControlsState, ChartUnit } from '../types'

const DENCUN_UPGRADE_TIMESTAMP = 1710288000

export function getCostsRenderParams(
  state: ChartControlsState,
): RenderParams<CostsData> {
  {
    if (state.data?.type !== 'costs') {
      throw new Error('Invalid data type')
    }

    const dataInRange = getEntriesByDays(
      state.timeRangeInDays,
      state.data.values,
      { trimLeft: true },
    )

    const points = dataInRange.map((dataPoint) => {
      const [timestamp] = dataPoint
      return {
        series: getSeries(dataPoint, state.unit),
        data: getData(dataPoint, state.unit),
        milestone: state.milestones[timestamp],
      }
    })

    const formatYAxisLabel = (value: number) =>
      state.unit === 'GAS'
        ? formatNumber(value)
        : formatCurrency(value, state.unit, { showLessThanMinimum: false })

    const seriesStyle: SeriesStyle[] = [
      {
        line: 'blue',
        fill: 'blue',
        point: 'circle',
      },
      {
        line: 'light-yellow',
        fill: 'light-yellow',
      },
      {
        line: 'pink',
        fill: 'pink',
      },
      {
        line: 'purple',
        fill: 'purple',
      },
    ]

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: (data) => renderCostsHover(data),
      useLogScale: state.useLogScale,
      range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
      theme: state.theme,
    }
  }
}

function getSeries(dataPoint: CostsChart['data'][number], unit: ChartUnit) {
  const [
    overheadGas,
    overheadEth,
    overheadUsd,
    calldataGas,
    calldataEth,
    calldataUsd,
    computeGas,
    computeEth,
    computeUsd,
    blobsGas,
    blobsEth,
    blobsUsd,
  ] = dataPoint.slice(4)
  switch (unit) {
    case 'USD':
      return [
        { value: overheadUsd + computeUsd + blobsUsd + calldataUsd },
        { value: overheadUsd + computeUsd + blobsUsd },
        { value: overheadUsd + computeUsd },
        { value: overheadUsd },
      ]
    case 'ETH':
      return [
        { value: overheadEth + computeEth + blobsEth + calldataEth },
        { value: overheadEth + computeEth + blobsEth },
        { value: overheadEth + computeEth },
        { value: overheadEth },
      ]
    case 'GAS':
      return [
        { value: overheadGas + computeGas + blobsGas + calldataGas },
        { value: overheadGas + computeGas + blobsGas },
        { value: overheadGas + computeGas },
        { value: overheadGas },
      ]
  }
}

function getData(
  dataPoint: CostsChart['data'][number],
  unit: ChartUnit,
): CostsData {
  const [
    timestamp,
    totalGas,
    totalEth,
    totalUsd,
    overheadGas,
    overheadEth,
    overheadUsd,
    calldataGas,
    calldataEth,
    calldataUsd,
    computeGas,
    computeEth,
    computeUsd,
    blobsGas,
    blobsEth,
    blobsUsd,
  ] = dataPoint

  const date = formatTimestamp(timestamp, { mode: 'datetime' })
  const isPostDencun = timestamp >= DENCUN_UPGRADE_TIMESTAMP
  switch (unit) {
    case 'USD':
      return {
        date,
        total: formatCurrency(totalUsd, 'usd'),
        calldata: formatCurrency(calldataUsd, 'usd'),
        blobs:
          isPostDencun && blobsUsd > 0
            ? formatCurrency(blobsUsd, 'usd')
            : undefined,
        compute: formatCurrency(computeUsd, 'usd'),
        overhead: formatCurrency(overheadUsd, 'usd'),
      }
    case 'ETH':
      return {
        date,
        total: formatCurrency(totalEth, 'eth'),
        calldata: formatCurrency(calldataEth, 'eth'),
        blobs:
          isPostDencun && blobsEth > 0
            ? formatCurrency(blobsEth, 'eth')
            : undefined,
        compute: formatCurrency(computeEth, 'eth'),
        overhead: formatCurrency(overheadEth, 'eth'),
      }
    case 'GAS':
      return {
        date,
        total: formatNumber(totalGas),
        calldata: formatNumber(calldataGas),
        blobs:
          isPostDencun && blobsGas > 0 ? formatNumber(blobsGas) : undefined,
        compute: formatNumber(computeGas),
        overhead: formatNumber(overheadGas),
      }
  }
}
