import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { type SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'
import { type ChartUnit } from '../types'

type TvlDataPoint = readonly [number, number, number, number]

interface Params {
  data: TvlDataPoint[] | undefined
  milestones: Milestone[]
  unit: ChartUnit
}

export function useRecategorizedTvlChartRenderParams({
  data,
  milestones,
  unit,
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
        const { values, data } = getChartValues(dataPoint)
        const milestone = mappedMilestones[timestamp]

        return {
          values,
          data,
          milestone,
        }
      }) ?? [],
    [data, mappedMilestones],
  )
  const total = useMemo(() => {
    const lastColumn = columns.at(-1)
    if (!lastColumn) {
      return undefined
    }
    const total =
      lastColumn.data.rollups +
      lastColumn.data.validiumsAndOptimiums +
      lastColumn.data.others
    return {
      usd: total / 100,
      eth: undefined,
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
        line: 'signature gradient',
        fill: 'signature gradient',
        point: 'pinkCircle',
      },
      {
        line: 'cyan gradient',
        fill: 'cyan gradient',
        point: 'cyanCircle',
      },
      {
        line: 'yellow gradient',
        fill: 'yellow gradient',
        point: 'yellowCircle',
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

function getChartValues(dataPoint: TvlDataPoint) {
  const [timestamp, rollups, validiumsAndOptimiums, others] = dataPoint

  const values = [rollups, validiumsAndOptimiums, others].map((value) => ({
    value: value / 100,
  }))

  return {
    values,
    data: {
      timestamp,
      rollups,
      validiumsAndOptimiums,
      others,
    },
  }
}
