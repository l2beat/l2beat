import { useId, useMemo } from 'react'
import { AreaChart, XAxis, YAxis } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/CyanGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { ChartStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

export type StackedSparklineColor = 'pink' | 'cyan' | 'yellow'

type SparklineHeight = 60 | 80 | 100 | 120 | 140 | 160

export interface StackedSparklineSeries {
  dataKey: string
  label: string
  color: StackedSparklineColor
}

export interface StackedSparklinePoint {
  timestamp: number
  [key: string]: number | null
}

interface Props {
  data: StackedSparklinePoint[] | undefined
  isLoading: boolean
  series: StackedSparklineSeries[]
  height?: SparklineHeight
  showYAxis?: boolean
  formatValue: (value: number) => string
  syncedUntil?: number
  className?: string
}

const STROKE_COLOR: Record<StackedSparklineColor, string> = {
  pink: 'var(--chart-pink)',
  cyan: 'var(--chart-cyan)',
  yellow: 'var(--chart-yellow)',
}

const HEIGHT_OVERRIDE: Record<SparklineHeight, string> = {
  60: '[&_.recharts-responsive-container]:!h-[60px] [&_.recharts-responsive-container]:!min-h-[60px]',
  80: '[&_.recharts-responsive-container]:!h-[80px] [&_.recharts-responsive-container]:!min-h-[80px]',
  100: '[&_.recharts-responsive-container]:!h-[100px] [&_.recharts-responsive-container]:!min-h-[100px]',
  120: '[&_.recharts-responsive-container]:!h-[120px] [&_.recharts-responsive-container]:!min-h-[120px]',
  140: '[&_.recharts-responsive-container]:!h-[140px] [&_.recharts-responsive-container]:!min-h-[140px]',
  160: '[&_.recharts-responsive-container]:!h-[160px] [&_.recharts-responsive-container]:!min-h-[160px]',
}

/**
 * Compact stacked area chart for the overview widgets. Renders multiple series
 * stacked on top of each other, using the shared `ChartContainer` so we get the
 * standard loader / no-data behaviour, but without a legend slot.
 */
export function OverviewStackedSparkline({
  data,
  isLoading,
  series,
  height = 120,
  showYAxis = false,
  formatValue,
  syncedUntil,
  className,
}: Props) {
  const rawId = useId()
  const idBase = rawId.replace(/:/g, '')

  const meta = useMemo<ChartMeta>(
    () =>
      Object.fromEntries(
        series.map((s) => [
          s.dataKey,
          {
            label: s.label,
            color: STROKE_COLOR[s.color],
            indicatorType: { shape: 'line' },
          },
        ]),
      ),
    [series],
  )

  return (
    <div className={cn(HEIGHT_OVERRIDE[height], className)}>
      <ChartContainer
        meta={meta}
        data={data}
        isLoading={isLoading}
        size="small"
      >
        <AreaChart
          responsive
          data={data}
          margin={{ top: 6, right: 1, bottom: 0, left: 0 }}
        >
          <defs>
            {series.map((s) => (
              <GradientDefs key={s.dataKey} color={s.color} idBase={idBase} />
            ))}
          </defs>
          <ChartStrokeOverFillAreaComponents
            data={series.map((s) => ({
              dataKey: s.dataKey,
              stackId: 'stack',
              type: 'monotone',
              stroke: `url(#${idBase}-${s.color}-stroke)`,
              fill: `url(#${idBase}-${s.color}-fill)`,
              activeDot: {
                r: 3,
                stroke: '#fff',
                strokeWidth: 1,
                fill: STROKE_COLOR[s.color],
              },
            }))}
          />
          {showYAxis ? (
            <ChartCommonComponents
              data={data}
              isLoading={isLoading}
              yAxis={{ tickCount: 3, tickFormatter: formatValue }}
              syncedUntil={syncedUntil}
            />
          ) : (
            <>
              <XAxis dataKey="timestamp" hide />
              <YAxis hide />
            </>
          )}
          <ChartTooltip
            content={
              <StackedTooltip series={series} formatValue={formatValue} />
            }
            filterNull={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function GradientDefs({
  color,
  idBase,
}: {
  color: StackedSparklineColor
  idBase: string
}) {
  const fillId = `${idBase}-${color}-fill`
  const strokeId = `${idBase}-${color}-stroke`
  switch (color) {
    case 'pink':
      return (
        <>
          <PinkFillGradientDef id={fillId} />
          <PinkStrokeGradientDef id={strokeId} />
        </>
      )
    case 'cyan':
      return (
        <>
          <CyanFillGradientDef id={fillId} />
          <CyanStrokeGradientDef id={strokeId} />
        </>
      )
    case 'yellow':
      return (
        <>
          <YellowFillGradientDef id={fillId} />
          <YellowStrokeGradientDef id={strokeId} />
        </>
      )
  }
}

function StackedTooltip({
  payload,
  label,
  series,
  formatValue,
}: CustomChartTooltipProps & {
  series: StackedSparklineSeries[]
  formatValue: (value: number) => string
}) {
  if (!payload || typeof label !== 'number') return null

  const total = payload.reduce<number | null>((acc, entry) => {
    if (entry.value === null || entry.value === undefined) return acc
    return (acc ?? 0) + entry.value
  }, null)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col">
        <span className="font-medium text-label-value-13 text-secondary">
          {formatTimestamp(label, { longMonthName: true })}
        </span>
        <div className="mt-2 mb-1.5 flex w-full items-center justify-between gap-2 font-medium text-label-value-14">
          <span className="text-secondary">Total</span>
          <span className="text-primary tabular-nums">
            {total !== null ? formatValue(total) : 'No data'}
          </span>
        </div>
        <HorizontalSeparator />
        <div className="mt-2 flex flex-col gap-1.5">
          {series.map((s) => {
            const entry = payload.find((p) => p.name === s.dataKey)
            const value = entry?.value ?? null
            return (
              <div
                key={s.dataKey}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-1.5 font-medium text-label-value-13">
                  <ChartDataIndicator
                    backgroundColor={STROKE_COLOR[s.color]}
                    type={{ shape: 'line' }}
                  />
                  <span className="text-secondary">{s.label}</span>
                </span>
                <span className="font-medium text-label-value-14 text-primary tabular-nums">
                  {value !== null ? formatValue(value) : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
