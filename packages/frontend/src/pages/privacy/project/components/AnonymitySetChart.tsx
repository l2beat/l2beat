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
import type { AnonymitySetCurves } from '~/server/features/privacy/anonymitySetCurves'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { AnonymitySetTooltip } from './AnonymitySetTooltip'
import { getLegendHeight } from './getAnonymitySetChartLayout'
import { useAnonymitySetChartMeta } from './useAnonymitySetChartMeta'

interface Props {
  curves: AnonymitySetCurves
  project?: ChartProject
}

/** Ticks that read well on a 7 to 365 day axis. */
const X_AXIS_TICKS = [7, 30, 90, 180, 270, 365]

export function AnonymitySetChart({ curves, project }: Props) {
  const chartMeta = useAnonymitySetChartMeta(curves.buckets)

  const chartData = useMemo(
    () =>
      curves.points.map(([days, ...setSizes]) => {
        const point: Record<string, number> = { days: days ?? 0 }
        curves.buckets.forEach((bucket, index) => {
          point[bucket.id] = setSizes[index] ?? 0
        })
        return point as { days: number } & Record<string, number>
      }),
    [curves],
  )

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
          // These charts carry far more series than a single legend row fits,
          // and the legend is the only place a series is named.
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
        <XAxis
          dataKey="days"
          type="number"
          domain={[
            curves.points[0]?.[0] ?? 7,
            curves.points.at(-1)?.[0] ?? 365,
          ]}
          ticks={X_AXIS_TICKS}
          // Without padding the first and last tick labels get clipped.
          padding={{ left: 10, right: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${value}d`}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          mirror
          tickCount={4}
          dy={-10}
          tick={{ width: 350 }}
          tickFormatter={(value: number) => formatInteger(Number(value))}
        />
        <ChartTooltip filterNull={false} content={<HoldingDurationTooltip />} />
      </LineChart>
    </ChartContainer>
  )
}

function HoldingDurationTooltip({ payload, label }: CustomChartTooltipProps) {
  if (typeof label !== 'number') return null

  return (
    <AnonymitySetTooltip
      payload={payload}
      title={`Held for up to ${formatInteger(label)} days`}
    />
  )
}
