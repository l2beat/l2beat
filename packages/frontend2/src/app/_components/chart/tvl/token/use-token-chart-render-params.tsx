import { type Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useCallback, useMemo } from 'react'
import { type ProjectToken } from '~/server/features/scaling/tvl/tokens/get-tokens-for-project'
import { formatCurrency } from '~/utils/format'
import { type SeriesStyle } from '../../core/styles'
import { mapMilestones } from '../../core/utils/map-milestones'
import { type ChartUnit } from '../../types'

export type TokenDataPoint = readonly [number, number, number]

interface Params {
  milestones: Milestone[]
  token: ProjectToken
  unit: ChartUnit
  data: TokenDataPoint[] | undefined
  isBridge?: boolean
}

export function useTokenChartRenderParams({
  milestones,
  token,
  unit,
  data,
  isBridge,
}: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) =>
      formatCurrency(value, unit === 'usd' ? 'usd' : token.symbol, {
        showLessThanMinimum: false,
      }),
    [token.symbol, unit],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp, amount, usdValue] = dataPoint

        const milestone = mappedMilestones[timestamp]

        return {
          values: [unit === 'usd' ? { value: usdValue } : { value: amount }],
          data: {
            timestamp,
            amount,
            usdValue,
          },
          milestone,
        }
      }) ?? [],
    [data, mappedMilestones, unit],
  )

  const chartRange: [number, number] = useMemo(
    () => [data?.[0]?.[0] ?? 0, data?.[data.length - 1]?.[0] ?? 1],
    [data],
  )
  const color = sourceToColor(token.source)

  const valuesStyle: SeriesStyle[] = [
    isBridge
      ? {
          line: 'signature gradient',
          fill: 'signature gradient',
          point: 'circle',
        }
      : {
          line: color,
          fill: color,
          point: 'circle',
        },
  ]

  return {
    columns,
    formatYAxisLabel,
    chartRange,
    valuesStyle,
  }
}

function sourceToColor(source: ProjectToken['source']) {
  switch (source) {
    case 'native':
      return 'pink'
    case 'canonical':
      return 'purple'
    case 'external':
      return 'yellow'
    default:
      assertUnreachable(source)
  }
}
