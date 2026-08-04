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
import { getShadeRamp } from '~/components/core/chart/utils/getShadeRamp'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { AnonymitySetCurves } from '~/server/features/privacy/anonymitySetCurves'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface Props {
  curves: AnonymitySetCurves
  scale?: ChartScale
  project?: ChartProject
}

/** Ticks that read well on a 7 to 365 day axis. */
const X_AXIS_TICKS = [7, 30, 90, 180, 270, 365]

/** Beyond this the tooltip is taller than the chart, so the tail is summarised. */
const MAX_TOOLTIP_ROWS = 12

export function AnonymitySetChart({
  curves,
  scale = 'linear',
  project,
}: Props) {
  // One hue per token family, one shade per bucket inside it. Families are
  // ordered by the data, so the busiest token gets the strongest hue.
  const chartMeta: ChartMeta = useMemo(() => {
    const families: string[] = []
    for (const bucket of curves.buckets) {
      if (!families.includes(bucket.family)) families.push(bucket.family)
    }

    const ramps = families.map((family, index) =>
      getShadeRamp(
        index,
        curves.buckets.filter((bucket) => bucket.family === family).length,
      ),
    )

    const shadeIndexes = new Map<string, number>()
    return Object.fromEntries(
      curves.buckets.map((bucket) => {
        const familyIndex = families.indexOf(bucket.family)
        const shade = shadeIndexes.get(bucket.family) ?? 0
        shadeIndexes.set(bucket.family, shade + 1)

        return [
          bucket.id,
          {
            label: bucket.label,
            color: ramps[familyIndex]?.[shade] ?? 'var(--chart-ethereum)',
            indicatorType: { shape: 'line' as const },
          },
        ]
      }),
    )
  }, [curves.buckets])

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

  // Recharts reserves legend space up front, so the rows a wrapped legend needs
  // have to be estimated rather than measured.
  const legendHeight = 18 * Math.ceil(curves.buckets.length / 7)

  // Left to itself a symlog axis renders a single gridline here, because the
  // series span four orders of magnitude. Decades make it readable.
  const logTicks = useMemo(() => {
    const max = chartData.reduce((highest, point) => {
      for (const key of dataKeys) {
        highest = Math.max(highest, point[key] ?? 0)
      }
      return highest
    }, 0)
    return [1, 10, 100, 1000, 10_000].filter((tick) => tick <= max * 1.5)
  }, [chartData, dataKeys])

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
          height={legendHeight}
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
          scale={scale === 'linear' ? 'auto' : scale}
          // A log axis anchored at zero squeezes every curve into the top of
          // the chart, so let it fit the data instead.
          domain={scale === 'linear' ? undefined : ['auto', 'auto']}
          ticks={scale === 'linear' ? undefined : logTicks}
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

  // Most series are empty at any given duration, and listing them all makes a
  // tooltip taller than the chart. Show the biggest sets, drop the empty ones.
  const ranked = payload
    .filter(
      (entry) =>
        entry.name !== undefined &&
        !entry.hide &&
        entry.type !== 'none' &&
        Number(entry.value ?? 0) > 0,
    )
    .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0))
  const shown = ranked.slice(0, MAX_TOOLTIP_ROWS)
  const hiddenCount = ranked.length - shown.length

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        Held for up to {formatInteger(label)} days
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {shown.map((entry) => {
          if (entry.name === undefined) return null

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
        {ranked.length === 0 && (
          <div className="font-medium text-label-value-14 text-secondary">
            No deposits in this window
          </div>
        )}
        {hiddenCount > 0 && (
          <div className="font-medium text-label-value-14 text-secondary">
            +{hiddenCount} smaller
          </div>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}
