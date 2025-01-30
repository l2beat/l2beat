import type { Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import { formatCurrency } from '~/utils/number-format/format-currency'
import type { SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'
import type { ChartUnit } from '../types'

type TvsDataPoint = readonly [number, number, number, number, number]

interface Params {
  data: TvsDataPoint[] | undefined
  milestones: Milestone[]
  unit: ChartUnit
}

export function useTvsChartRenderParams({ data, milestones, unit }: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) => formatCurrency(value, unit),
    [unit],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp] = dataPoint
        const { values, data } = getChartValues(dataPoint, unit)
        const milestone = mappedMilestones[timestamp]

        return {
          values,
          data,
          milestone,
        }
      }) ?? [],
    [data, mappedMilestones, unit],
  )
  const total = useMemo(() => {
    const lastColumn = columns.at(-1)
    if (!lastColumn) {
      return undefined
    }
    return {
      usd: lastColumn.data.usdValue,
      eth: lastColumn.data.ethValue,
    }
  }, [columns])

  const firstValue = useMemo(() => columns[0]?.values[0]?.value, [columns])
  const lastValue = useMemo(
    () => columns[columns.length - 1]?.values[0]!.value ?? 0,
    [columns],
  )
  const change = useMemo(
    () => (lastValue && firstValue ? lastValue / firstValue - 1 : 0),
    [firstValue, lastValue],
  )

  const chartRange = useMemo(() => getChartRange(data), [data])

  const valuesStyle: SeriesStyle[] = useMemo(
    () => [
      {
        fill: 'signature gradient',
        line: 'signature gradient',
        point: 'circle',
      },
    ],
    [],
  )

  return {
    change,
    columns,
    chartRange,
    valuesStyle,
    formatYAxisLabel,
    total,
  }
}

function getChartValues(dataPoint: TvsDataPoint, unit: CostsUnit) {
  const [timestamp, canonical, external, native, ethPrice] = dataPoint
  const usdSum = canonical + external + native
  const usdValue = usdSum / 100
  const ethValue = usdSum / ethPrice

  return {
    values: [{ value: unit === 'usd' ? usdValue : ethValue }],
    data: {
      timestamp,
      usdValue,
      ethValue,
    },
  }
}
