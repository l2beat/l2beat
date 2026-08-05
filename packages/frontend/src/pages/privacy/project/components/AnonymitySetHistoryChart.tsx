import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type {
  ChartProject,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getXAxisProps } from '~/components/core/chart/utils/getXAxisProps'
import type { AnonymitySetCurves } from '~/server/features/privacy/anonymitySetCurves'
import { formatTimestamp } from '~/utils/dates'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { ChartRange } from '~/utils/range/range'
import { AnonymitySetTooltip } from './AnonymitySetTooltip'
import { getLegendHeight } from './getAnonymitySetChartLayout'
import { useAnonymitySetChartMeta } from './useAnonymitySetChartMeta'

interface Props {
  curves: AnonymitySetCurves
  project?: ChartProject
  /** Which slice of the history to draw. Defaults to all of it. */
  range?: ChartRange
}

/**
 * The trailing `windowDays` anonymity set over time: the value at a date is how
 * many unique addresses had deposited in the preceding month, i.e. the crowd
 * you would have blended into had you withdrawn on that day.
 *
 * Covers the project's whole life, from its first deposit up to the snapshot
 * date, and plots the same buckets in the same colors as `AnonymitySetChart`,
 * so the two can be read against each other.
 */
export function AnonymitySetHistoryChart({ curves, project, range }: Props) {
  const chartMeta = useAnonymitySetChartMeta(curves.buckets)

  const chartData = useMemo(() => {
    const [from, to] = range ?? [null, Number.POSITIVE_INFINITY]

    return curves.history
      .filter(
        ([timestamp = 0]) =>
          (from === null || timestamp >= from) && timestamp <= to,
      )
      .map(([timestamp, ...setSizes]) => {
        const point: Record<string, number> = { timestamp: timestamp ?? 0 }
        curves.buckets.forEach((bucket, index) => {
          point[bucket.id] = setSizes[index] ?? 0
        })
        return point as { timestamp: number } & Record<string, number>
      })
  }, [curves, range])

  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      project={project}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
    >
      <LineChart
        responsive
        data={chartData}
        margin={{ top: 20, right: project ? 0 : 1 }}
      >
        <ChartLegend
          content={
            <ChartLegendContent className="h-auto w-full flex-wrap justify-center gap-x-3 gap-y-1" />
          }
          height={getLegendHeight(curves.buckets.length)}
        />
        <CartesianGrid vertical={false} syncWithTicks />
        {curves.buckets.map((bucket) => (
          <Line
            key={bucket.id}
            dataKey={bucket.id}
            stroke={chartMeta[bucket.id]?.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            hide={!dataKeys.includes(bucket.id)}
          />
        ))}
        <XAxis {...getXAxisProps(chartData)} />
        <YAxis
          tickLine={false}
          axisLine={false}
          mirror
          tickCount={4}
          dy={-10}
          tick={{ width: 350 }}
          tickFormatter={(value: number) => formatInteger(Number(value))}
        />
        <ChartTooltip
          filterNull={false}
          content={<HistoryTooltip windowDays={curves.historyWindowDays} />}
        />
      </LineChart>
    </ChartContainer>
  )
}

function HistoryTooltip({
  payload,
  label,
  windowDays,
}: CustomChartTooltipProps & { windowDays?: number }) {
  if (typeof label !== 'number') return null

  return (
    <AnonymitySetTooltip
      payload={payload}
      title={`${windowDays ?? 30} days before ${formatTimestamp(label, { mode: 'date', longMonthName: true })}`}
    />
  )
}
