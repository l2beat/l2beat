import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type ActivityChartData } from '~/server/features/scaling/activity/get-activity-chart'
import { countToTps } from '~/server/features/scaling/activity/utils/count-to-tps'
import { formatTps } from '~/utils/number-format/format-tps'
import { type SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'

interface Params {
  milestones: Milestone[]
  chart: ActivityChartData | undefined
  showMainnet: boolean
}

export function useActivityChartRenderParams({
  milestones,
  chart,
  showMainnet,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) => `${formatTps(value, { morePrecision: true })} TPS`,
    [],
  )

  const columns = useMemo(
    () =>
      chart?.data.map((dataPoint) => {
        const [timestamp, count, ethereumCount] = dataPoint
        const milestone = mappedMilestones[timestamp]
        const tps = countToTps(count)
        const ethereumTps = countToTps(ethereumCount)

        return {
          values: showMainnet
            ? [{ value: tps }, { value: ethereumTps }]
            : [{ value: tps }],
          data: { timestamp, count, ethereumCount },
          milestone,
        }
      }) ?? [],
    [chart, mappedMilestones, showMainnet],
  )

  const chartRange = useMemo(() => getChartRange(chart?.data), [chart])

  const valuesStyle: SeriesStyle[] = useMemo(
    () =>
      showMainnet
        ? [
            {
              fill: 'signature gradient',
              line: 'signature gradient',
              point: 'redCircle',
            },
            {
              fill: 'blue gradient',
              line: 'blue gradient',
              point: 'blueSquare',
            },
          ]
        : [
            {
              fill: 'signature gradient',
              line: 'signature gradient',
              point: 'redCircle',
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
