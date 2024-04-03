import { formatLargeNumber, formatTimestamp } from '../../../../utils'
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
        ? formatLargeNumber(value)
        : formatCurrency(value, state.unit)

    const seriesStyle: SeriesStyle[] = [
      {
        line: 'blue',
        fill: 'blue',
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
      {
        line: 'green',
        fill: 'green',
      },
    ]

    return {
      formatYAxisLabel,
      points,
      seriesStyle,
      renderHoverContents: (data) => renderCostsHover(data),
      useLogScale: state.useLogScale,
      range: [dataInRange[0][0], dataInRange[dataInRange.length - 1][0]],
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
        overheadUsd + computeUsd + blobsUsd + calldataUsd,
        overheadUsd + computeUsd + blobsUsd,
        overheadUsd + computeUsd,
        overheadUsd,
      ]
    case 'ETH':
      return [
        overheadEth + computeEth + blobsEth + calldataEth,
        overheadEth + computeEth + blobsEth,
        overheadEth + computeEth,
        overheadEth,
      ]
    case 'GAS':
      return [
        overheadGas + computeGas + blobsGas + calldataGas,
        overheadGas + computeGas + blobsGas,
        overheadGas + computeGas,
        overheadGas,
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
        blobs: isPostDencun ? formatCurrency(blobsUsd, 'usd') : undefined,
        compute: formatCurrency(computeUsd, 'usd'),
        overhead: formatCurrency(overheadUsd, 'usd'),
      }
    case 'ETH':
      return {
        date,
        total: formatCurrency(totalEth, 'eth'),
        calldata: formatCurrency(calldataEth, 'eth'),
        blobs: isPostDencun ? formatCurrency(blobsEth, 'eth') : undefined,
        compute: formatCurrency(computeEth, 'eth'),
        overhead: formatCurrency(overheadEth, 'eth'),
      }
    case 'GAS':
      return {
        date,
        total: formatLargeNumber(totalGas),
        calldata: formatLargeNumber(calldataGas),
        blobs: isPostDencun ? formatLargeNumber(blobsGas) : undefined,
        compute: formatLargeNumber(computeGas),
        overhead: formatLargeNumber(overheadGas),
      }
  }
}
