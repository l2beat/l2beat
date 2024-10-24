import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type ActivityChartData } from '~/server/features/scaling/activity/get-activity-chart'
import { countToUops } from '~/server/features/scaling/activity/utils/count-to-uops'
import { formatUops } from '~/utils/number-format/format-uops'
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
    (value: number) => `${formatUops(value, { morePrecision: true })} UOPS`,
    [],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp, count, ethereumCount] = dataPoint
        const milestone = mappedMilestones[timestamp]
        const tps = countToUops(count)
        const ethereumTps = countToUops(ethereumCount)

        return {
          values: showMainnet
            ? [{ value: tps }, { value: ethereumTps }]
            : [{ value: tps }],
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
