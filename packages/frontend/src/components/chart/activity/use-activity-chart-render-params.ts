import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type ActivityChartData } from '~/server/features/scaling/activity/get-activity-chart'
import { formatTps } from '~/utils/number-format/format-tps'
import { type SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'

interface Params {
  milestones: Milestone[]
  data: ActivityChartData | undefined
  showMainnet: boolean
}

export function useActivityChartRenderParams({
  milestones,
  data,
  showMainnet,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) => `${formatTps(value)} TPS`,
    [],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
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
    [data, mappedMilestones, showMainnet],
  )

  const chartRange = useMemo(() => getChartRange(data), [data])

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
