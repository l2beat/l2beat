import type { Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import { formatCurrency } from '~/utils/number-format/format-currency'
import type { SeriesStyle } from '../../core/styles'
import { getChartRange } from '../../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../../core/utils/map-milestones'
import type { ChartUnit } from '../../types'

type TvsDataPoint = readonly [number, number, number, number, number]

interface Params {
  milestones: Milestone[]
  unit: ChartUnit
  data?: TvsDataPoint[]
}

export function useStackedTvsChartRenderParams({
  milestones,
  unit,
  data,
}: Params) {
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
    const total =
      lastColumn.data.canonical +
      lastColumn.data.external +
      lastColumn.data.native
    return {
      usd: total / 100,
      eth: total / lastColumn.data.ethPrice,
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
    ],
    [],
  )

  return {
    columns,
    chartRange,
    valuesStyle,
    formatYAxisLabel,
    change,
    total,
  }
}

function getChartValues(dataPoint: TvsDataPoint, unit: CostsUnit) {
  const [timestamp, native, canonical, external, ethPrice] = dataPoint

  const values = [native + canonical + external, external + native, native].map(
    (value) => ({
      value: unit === 'usd' ? value / 100 : value / ethPrice,
    }),
  )

  return {
    values,
    data: {
      timestamp,
      native,
      canonical,
      external,
      ethPrice,
    },
  }
}
