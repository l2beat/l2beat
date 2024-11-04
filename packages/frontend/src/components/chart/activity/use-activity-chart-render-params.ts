import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { type ActivityChartData } from '~/server/features/scaling/activity/get-activity-chart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { formatUops } from '~/utils/number-format/format-uops'
import { type SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'

interface Params {
  milestones: Milestone[]
  data: ActivityChartData | undefined
  showMainnet: boolean
  metric: ActivityMetric
}

export function useActivityChartRenderParams({
  milestones,
  data,
  showMainnet,
  metric,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) =>
      `${formatUops(value, { morePrecision: true })} ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
    [metric],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp, count, ethereumCount, uopsCount, ethereumUopsCount] =
          dataPoint
        const milestone = mappedMilestones[timestamp]
        const tps = countPerSecond(count)
        const ethereumTps = countPerSecond(ethereumCount)
        const uops = countPerSecond(uopsCount)
        const ethereumUops = countPerSecond(ethereumUopsCount)

        const isTps = metric === 'tps'
        const projectsValue = isTps ? tps : uops
        const ethereumValue = isTps ? ethereumTps : ethereumUops

        return {
          values: showMainnet
            ? [{ value: projectsValue }, { value: ethereumValue }]
            : [{ value: projectsValue }],
          data: {
            timestamp,
            count: isTps ? count : uopsCount,
            ethereumCount: isTps ? ethereumCount : ethereumUopsCount,
          },
          milestone,
        }
      }) ?? [],
    [data, mappedMilestones, showMainnet, metric],
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
