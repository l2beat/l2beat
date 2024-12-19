import { type Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useCallback, useMemo } from 'react'
import { type ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { type ActivityChartData } from '~/server/features/scaling/activity/get-activity-chart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { getFirstTwoNonZeroPrecision } from '~/utils/get-first-two-non-zero-precision'
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
    (value: number, values?: number[]) => {
      const decimals = values?.every((v) => v % 1 === 0)
        ? 0
        : value < 1
          ? getFirstTwoNonZeroPrecision(value)
          : 2
      return `${formatActivityCount(value, { decimals })} ${metric === 'tps' ? 'TPS' : 'UOPS'}`
    },
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
            ? [{ value: ethereumValue }, { value: projectsValue }]
            : [{ value: projectsValue }],
          data: {
            timestamp,
            ethereumCount: isTps ? ethereumCount : ethereumUopsCount,
            count: isTps ? count : uopsCount,
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
            {
              fill: 'blue gradient',
              line: 'blue gradient',
              point: 'blueSquare',
            },
            getChartColors(type),
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
