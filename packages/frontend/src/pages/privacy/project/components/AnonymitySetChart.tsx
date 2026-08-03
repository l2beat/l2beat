import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { ChartScale } from '~/components/chart/types'
import type {
  ChartMeta,
  ChartProject,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { AnonymitySetCurves } from '~/server/features/privacy/anonymitySetCurves'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface Props {
  curves: AnonymitySetCurves
  scale?: ChartScale
  project?: ChartProject
}

const COLORS = [
  'var(--chart-emerald)',
  'var(--chart-pink)',
  'var(--chart-sky)',
] as const

/** Ticks that read well on a 7 to 365 day axis. */
const X_AXIS_TICKS = [7, 30, 90, 180, 270, 365]

export function AnonymitySetChart({
  curves,
  scale = 'linear',
  project,
}: Props) {
  const chartMeta: ChartMeta = useMemo(
    () =>
      Object.fromEntries(
        curves.buckets.map((bucket, index) => [
          bucket.id,
          {
            label: bucket.label,
            color: COLORS[index % COLORS.length] ?? COLORS[0],
            indicatorType: { shape: 'line' as const },
          },
        ]),
      ),
    [curves.buckets],
  )

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
        <ChartLegend content={<ChartLegendContent />} />
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
          scale={scale === 'linear' ? 'auto' : scale}
          // A log axis anchored at zero squeezes every curve into the top of
          // the chart, so let it fit the data instead.
          domain={scale === 'linear' ? undefined : ['auto', 'auto']}
          tickFormatter={(value: number) => formatInteger(Number(value))}
        />
        <ChartTooltip filterNull={false} content={<AnonymitySetTooltip />} />
      </LineChart>
    </ChartContainer>
  )
}

function AnonymitySetTooltip({ payload, label }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        Held for up to {formatInteger(label)} days
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry) => {
          if (entry.name === undefined || entry.hide || entry.type === 'none') {
            return null
          }

          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={config.indicatorType}
                  backgroundColor={config.color}
                />
                <span className="font-medium text-label-value-14">
                  {config.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {formatInteger(Number(entry.value ?? 0))}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
