import { type Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useCallback, useMemo } from 'react'
import { type ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { type ActivityChartData } from '~/server/features/scaling/activity/get-activity-chart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { type SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'

export type ActivityChartType = 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'

interface Params {
  milestones: Milestone[]
  chart: ActivityChartData | undefined
  showMainnet: boolean
  metric?: ActivityMetric
  type?: ActivityChartType
}

export function useActivityChartRenderParams({
  milestones,
  chart,
  showMainnet,
  metric,
  type,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) =>
      `${formatActivityCount(value, { morePrecision: true })} ${metric === 'tps' ? 'TPS' : 'UOPS'}`,
    [metric],
  )

  const columns = useMemo(
    () =>
      chart?.data.map((dataPoint) => {
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
    [chart, mappedMilestones, showMainnet, metric],
  )

  const chartRange = useMemo(() => getChartRange(chart?.data), [chart])

  const valuesStyle: SeriesStyle[] = useMemo(
    () =>
      showMainnet
        ? [
            getChartColors(type),
            {
              fill: 'blue gradient',
              line: 'blue gradient',
              point: 'blueSquare',
            },
          ]
        : [getChartColors(type)],
    [showMainnet, type],
  )

  return {
    formatYAxisLabel,
    columns,
    chartRange,
    valuesStyle,
  }
}

function getChartColors(type?: ActivityChartType): SeriesStyle {
  switch (type) {
    case 'Rollups':
      return {
        fill: 'signature gradient',
        line: 'signature gradient',
        point: 'pinkCircle',
      }
    case 'ValidiumsAndOptimiums':
      return {
        fill: 'cyan gradient',
        line: 'cyan gradient',
        point: 'cyanCircle',
      }
    case 'Others':
    case undefined:
      return {
        fill: 'yellow gradient',
        line: 'yellow gradient',
        point: 'yellowCircle',
      }
    default:
      assertUnreachable(type)
  }
}
