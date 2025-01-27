import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type RecategorisedActivityChartData } from '~/server/features/scaling/activity/get-recategorised-activity-chart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { getFirstTwoNonZeroPrecision } from '~/utils/get-first-two-non-zero-precision'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { type SeriesStyle } from '../core/styles'
import { getChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'

interface Params {
  milestones: Milestone[]
  chart: RecategorisedActivityChartData | undefined
}

export function useRecategorisedActivityChartRenderParams({
  milestones,
  chart,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback((value: number, values?: number[]) => {
    const decimals = values?.every((v) => v % 1 === 0)
      ? 0
      : value < 1
        ? getFirstTwoNonZeroPrecision(value)
        : 2
    return `${formatActivityCount(value, { decimals })} UOPS`
  }, [])

  const columns = useMemo(
    () =>
      chart?.data.map((dataPoint) => {
        const [
          timestamp,
          rollupsCount,
          validiumAndOptimiumsCount,
          othersCount,
          ethereumCount,
        ] = dataPoint
        const milestone = mappedMilestones[timestamp]
        const rollupsUops = countPerSecond(rollupsCount)
        const validiumAndOptimiumsUops = countPerSecond(
          validiumAndOptimiumsCount,
        )
        const othersUops = countPerSecond(othersCount)
        const ethereumUops = countPerSecond(ethereumCount)

        return {
          values: [
            { value: rollupsUops },
            { value: validiumAndOptimiumsUops },
            { value: othersUops },
            { value: ethereumUops },
          ],
          data: {
            timestamp,
            rollupsCount,
            validiumAndOptimiumsCount,
            othersCount,
            ethereumCount,
          },
          milestone,
        }
      }) ?? [],
    [chart, mappedMilestones],
  )

  const chartRange = useMemo(() => getChartRange(chart?.data), [chart])

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
      {
        fill: 'blue gradient',
        line: 'blue gradient',
        point: 'blueCircle',
      },
    ],
    [],
  )

  return {
    formatYAxisLabel,
    columns,
    chartRange,
    valuesStyle,
  }
}
