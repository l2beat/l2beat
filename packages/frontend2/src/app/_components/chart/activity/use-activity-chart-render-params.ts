import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type RouterOutputs } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { type SeriesStyle } from '../core/styles'
import { mapMilestones } from '../core/utils/map-milestones'

interface Params {
  milestones: Milestone[]
  unit: 'usd' | 'eth'
  chart: RouterOutputs['scaling']['activity']['chart']['data'] | undefined
  showMainnet: boolean
}

export function useActivityChartRenderParams({
  milestones,
  unit,
  chart,
  showMainnet,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) =>
      formatCurrency(value, unit, { showLessThanMinimum: false }),
    [unit],
  )

  const columns = useMemo(
    () =>
      chart?.map((dataPoint) => {
        const [timestamp, count, ethereumCount] = dataPoint
        const milestone = mappedMilestones[timestamp]

        return {
          values: showMainnet
            ? [{ value: count }, { value: ethereumCount }]
            : [{ value: count }],
          data: { timestamp, count, ethereumCount },
          milestone,
        }
      }) ?? [],
    [chart, mappedMilestones, showMainnet],
  )

  const chartRange: [number, number] = useMemo(
    () => [chart?.[0]?.[0] ?? 0, chart?.[chart.length - 1]?.[0] ?? 1],
    [chart],
  )

  const valuesStyle: SeriesStyle[] = useMemo(
    () =>
      showMainnet
        ? [
            {
              fill: 'signature gradient',
              line: 'signature gradient',
              point: 'circle',
            },
            {
              line: 'blue',
              point: 'circle',
            },
          ]
        : [
            {
              fill: 'signature gradient',
              line: 'signature gradient',
              point: 'circle',
            },
          ],
    [showMainnet],
  )

  return {
    formatYAxisLabel,
    columns,
    chartRange,
    valuesStyle,
  }
}
