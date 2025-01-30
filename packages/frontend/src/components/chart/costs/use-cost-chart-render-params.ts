import type { Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useCallback, useMemo } from 'react'
import type { CostsChartData } from '~/server/features/scaling/costs/get-costs-chart'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'
import type { SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'
import type { CostsChartPointData } from './costs-chart-hover'

const DENCUN_UPGRADE_TIMESTAMP = 1710288000

interface Params {
  milestones: Milestone[]
  unit: CostsUnit
  data: CostsChartData | undefined
}

export function useCostChartRenderParams({ milestones, unit, data }: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) =>
      unit === 'gas' ? formatNumber(value) : formatCurrency(value, unit),
    [unit],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp] = dataPoint

        return {
          values: getValues(dataPoint, unit),
          data: getData(dataPoint, unit),
          milestone: mappedMilestones[timestamp],
        }
      }) ?? [],
    [data, mappedMilestones, unit],
  )

  const chartRange = useMemo(() => getChartRange(data), [data])

  const valuesStyle: SeriesStyle[] = useMemo(
    () => [
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
    ],
    [],
  )

  return {
    formatYAxisLabel,
    columns,
    chartRange,
    valuesStyle,
  }
}

function getValues(dataPoint: CostsChartData[number], unit: CostsUnit) {
  const [
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
  dataPoint: CostsChartData[number],
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
