import { type Milestone } from '@l2beat/config'
import { mapMilestones } from '../utils/map-milestones'
import {
  type CostsChartResponse,
  type CostsUnit,
} from '~/server/features/scaling/costs/types'
import { formatNumber } from '~/utils/format-number'
import { formatCurrency } from '~/utils/format'
import { assertUnreachable } from '@l2beat/shared-pure'
import { type SeriesStyle } from '../core/styles'

const DENCUN_UPGRADE_TIMESTAMP = 1710288000

interface CostsChartPointData {
  timestamp: number
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}

interface Params {
  milestones: Milestone[]
  unit: CostsUnit
  chart: CostsChartResponse | undefined
}

export function getCommonCostsChartProps({ milestones, unit, chart }: Params) {
  const mappedMilestones = mapMilestones(milestones)

  const formatYAxisLabel = (value: number) =>
    unit === 'gas'
      ? formatNumber(value)
      : formatCurrency(value, unit, { showLessThanMinimum: false })

  const columns =
    chart?.data.map((dataPoint) => {
      const [timestamp] = dataPoint

      return {
        values: getValues(dataPoint, unit),
        data: getData(dataPoint, unit),
        milestone: mappedMilestones[timestamp],
      }
    }) ?? []

  const rangeStart = chart?.data[0]?.[0] ?? 0
  const rangeEnd = chart?.data[chart.data.length - 1]?.[0] ?? 1
  const chartRange: [number, number] = [rangeStart, rangeEnd]

  const valuesStyle: SeriesStyle[] = [
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
    columns,
    chartRange,
    valuesStyle,
  }
}

function getValues(
  dataPoint: CostsChartResponse['data'][number],
  unit: CostsUnit,
) {
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
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
  switch (unit) {
    case 'usd':
      return [
        { value: overheadUsd + computeUsd + (blobsUsd ?? 0) + calldataUsd },
        { value: overheadUsd + computeUsd + (blobsUsd ?? 0) },
        { value: overheadUsd + computeUsd },
        { value: overheadUsd },
      ]
    case 'eth':
      return [
        { value: overheadEth + computeEth + (blobsEth ?? 0) + calldataEth },
        { value: overheadEth + computeEth + (blobsEth ?? 0) },
        { value: overheadEth + computeEth },
        { value: overheadEth },
      ]
    case 'gas':
      return [
        { value: overheadGas + computeGas + (blobsGas ?? 0) + calldataGas },
        { value: overheadGas + computeGas + (blobsGas ?? 0) },
        { value: overheadGas + computeGas },
        { value: overheadGas },
      ]
    default:
      assertUnreachable(unit)
  }
}

function getData(
  dataPoint: CostsChartResponse['data'][number],
  unit: CostsUnit,
): CostsChartPointData {
  const [
    timestamp,
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

  const isPostDencun = timestamp >= DENCUN_UPGRADE_TIMESTAMP
  switch (unit) {
    case 'usd':
      return {
        timestamp,
        total: calldataUsd + computeUsd + (blobsUsd ?? 0) + overheadUsd,
        calldata: calldataUsd,
        blobs: isPostDencun && blobsUsd && blobsUsd > 0 ? blobsUsd : undefined,
        compute: computeUsd,
        overhead: overheadUsd,
      }
    case 'eth':
      return {
        timestamp,
        total: calldataEth + computeEth + (blobsEth ?? 0) + overheadEth,
        calldata: calldataEth,
        blobs: isPostDencun && blobsEth && blobsEth > 0 ? blobsEth : undefined,
        compute: computeEth,
        overhead: overheadEth,
      }
    case 'gas':
      return {
        timestamp,
        total: calldataGas + computeGas + (blobsGas ?? 0) + overheadGas,
        calldata: calldataGas,
        blobs: isPostDencun && blobsGas && blobsGas > 0 ? blobsGas : undefined,
        compute: computeGas,
        overhead: overheadGas,
      }
  }
}
