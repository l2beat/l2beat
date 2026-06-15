import { useId, useMemo } from 'react'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'
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
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { CyanFillGradientDef } from '~/components/core/chart/defs/CyanGradientDef'
import { PinkFillGradientDef } from '~/components/core/chart/defs/PinkGradientDef'
import { SkyFillGradientDef } from '~/components/core/chart/defs/SkyGradientDef'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import {
  getOverviewSparklineYAxisProps,
  OVERVIEW_SPARKLINE_Y_AXIS_TICK_CLASS,
} from '../overviewChartHeight'

export type OverviewSparklineColor = 'pink' | 'cyan' | 'sky' | 'purple'

export type OverviewSparklineHeight =
  | 44
  | 48
  | 52
  | 56
  | 60
  | 80
  | 96
  | 100
  | 104
  | 108
  | 112
  | 120
  | 140
  | 160
  /** Grow to fill the parent's available height (parent must define a height). */
  | 'fill'

export interface OverviewSparklineDataPoint {
  timestamp: number
  value: number | null
  /** If set, TVS tooltip shows rollups / Validiums & Optimiums for this day */
  tvsBreakdown?: {
    rollups: number | null
    validiumsAndOptimiums: number | null
  }
}

interface Props {
  data: OverviewSparklineDataPoint[] | undefined
  isLoading: boolean
  color: OverviewSparklineColor
  tooltipLabel: string
  formatValue: (value: number) => string
  syncedUntil?: number
  height?: OverviewSparklineHeight
  showYAxis?: boolean
  className?: string
}

const STROKE_COLOR: Record<OverviewSparklineColor, string> = {
  pink: 'var(--chart-pink)',
  cyan: 'var(--chart-cyan)',
  sky: 'var(--chart-sky)',
  purple: 'var(--chart-stacked-purple)',
}

// Tailwind needs to see every full class string statically.
const HEIGHT_OVERRIDE: Record<OverviewSparklineHeight, string> = {
  44: '[&_.recharts-responsive-container]:!h-[44px] [&_.recharts-responsive-container]:!min-h-[44px]',
  48: '[&_.recharts-responsive-container]:!h-[48px] [&_.recharts-responsive-container]:!min-h-[48px]',
  52: '[&_.recharts-responsive-container]:!h-[52px] [&_.recharts-responsive-container]:!min-h-[52px]',
  56: '[&_.recharts-responsive-container]:!h-[56px] [&_.recharts-responsive-container]:!min-h-[56px]',
  60: '[&_.recharts-responsive-container]:!h-[60px] [&_.recharts-responsive-container]:!min-h-[60px]',
  80: '[&_.recharts-responsive-container]:!h-[80px] [&_.recharts-responsive-container]:!min-h-[80px]',
  96: '[&_.recharts-responsive-container]:!h-[96px] [&_.recharts-responsive-container]:!min-h-[96px]',
  100: '[&_.recharts-responsive-container]:!h-[100px] [&_.recharts-responsive-container]:!min-h-[100px]',
  104: '[&_.recharts-responsive-container]:!h-[104px] [&_.recharts-responsive-container]:!min-h-[104px]',
  108: '[&_.recharts-responsive-container]:!h-[108px] [&_.recharts-responsive-container]:!min-h-[108px]',
  112: '[&_.recharts-responsive-container]:!h-[112px] [&_.recharts-responsive-container]:!min-h-[112px]',
  120: '[&_.recharts-responsive-container]:!h-[120px] [&_.recharts-responsive-container]:!min-h-[120px]',
  140: '[&_.recharts-responsive-container]:!h-[140px] [&_.recharts-responsive-container]:!min-h-[140px]',
  160: '[&_.recharts-responsive-container]:!h-[160px] [&_.recharts-responsive-container]:!min-h-[160px]',
  fill: 'h-full min-h-[120px] [&>div]:h-full [&_.recharts-wrapper]:h-full! [&_.recharts-wrapper]:min-h-0! [&_.recharts-wrapper]:aspect-auto!',
}

/**
 * Sleek single-series line/area sparkline used inside the overview widgets.
 * Wraps Recharts' AreaChart through `ChartContainer` (size="small") so we get
 * the shared loader / no-data state, but omits the legend slot and lets each
 * caller decide whether to show a minimal y-axis.
 */
export function OverviewSparkline({
  data,
  isLoading,
  color,
  tooltipLabel,
  formatValue,
  syncedUntil,
  height = 80,
  showYAxis = false,
  className,
}: Props) {
  const rawId = useId()
  const fillId = `overview-sparkline-fill-${rawId.replace(/:/g, '')}`

  const stroke = STROKE_COLOR[color]
  const meta = useMemo<ChartMeta>(
    () => ({
      value: {
        label: tooltipLabel,
        color: stroke,
        indicatorType: { shape: 'line' },
      },
    }),
    [stroke, tooltipLabel],
  )

  const chartMargin = showYAxis
    ? { top: 10, right: 1, bottom: 0, left: 0 }
    : { top: 6, right: 1, bottom: 0, left: 0 }

  return (
    <div
      className={cn(
        HEIGHT_OVERRIDE[height],
        showYAxis && OVERVIEW_SPARKLINE_Y_AXIS_TICK_CLASS,
        className,
      )}
    >
      <ChartContainer
        meta={meta}
        data={data}
        isLoading={isLoading}
        size="small"
      >
        <AreaChart responsive data={data} margin={chartMargin}>
          <defs>
            {color === 'pink' && <PinkFillGradientDef id={fillId} />}
            {color === 'cyan' && <CyanFillGradientDef id={fillId} />}
            {color === 'sky' && <SkyFillGradientDef id={fillId} />}
            {color === 'purple' && (
              <CustomFillGradientDef
                id={fillId}
                colors={{
                  primary: 'var(--chart-stacked-purple)',
                  secondary: 'var(--chart-stacked-purple)',
                }}
              />
            )}
          </defs>
          <Area
            dataKey="value"
            type="monotone"
            stroke={stroke}
            strokeWidth={1.75}
            fill={`url(#${fillId})`}
            fillOpacity={1}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
            activeDot={{
              r: 3,
              stroke: '#fff',
              strokeWidth: 1,
              fill: stroke,
            }}
          />
          {showYAxis ? (
            <ChartCommonComponents
              data={data}
              isLoading={isLoading}
              hideXAxis
              yAxis={getOverviewSparklineYAxisProps(formatValue)}
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
              <SparklineTooltip
                tooltipLabel={tooltipLabel}
                formatValue={formatValue}
              />
            }
            filterNull={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function SparklineTooltip({
  payload,
  label,
  tooltipLabel,
  formatValue,
}: CustomChartTooltipProps & {
  tooltipLabel: string
  formatValue: (value: number) => string
}) {
  if (!payload || typeof label !== 'number') return null
  const entry = payload[0]
  if (!entry) return null
  const row = entry.payload as OverviewSparklineDataPoint | undefined
  const breakdown = row?.tvsBreakdown
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-[15rem] max-w-[min(100vw-2rem,20rem)] flex-col gap-1">
        <span className="font-medium text-label-value-13 text-secondary">
          {formatTimestamp(label, { longMonthName: true })}
        </span>
        <div className="flex items-center justify-between gap-3 font-medium text-label-value-14">
          <span className="text-secondary">{tooltipLabel}</span>
          <span className="text-primary tabular-nums">
            {entry.value !== null && entry.value !== undefined
              ? formatValue(entry.value)
              : 'No data'}
          </span>
        </div>
        {breakdown !== undefined ? (
          <div className="mt-1 border-divider border-t pt-2 font-medium text-label-value-12 text-secondary leading-snug">
            <p className="text-pretty">
              <span className="text-primary">Rollups</span>{' '}
              <span className="text-primary tabular-nums">
                {breakdown.rollups !== null && breakdown.rollups !== undefined
                  ? formatValue(breakdown.rollups)
                  : EM_DASH}
              </span>
              <span> · </span>
              <span className="text-primary">Validiums & Optimiums</span>{' '}
              <span className="text-primary tabular-nums">
                {breakdown.validiumsAndOptimiums !== null &&
                breakdown.validiumsAndOptimiums !== undefined
                  ? formatValue(breakdown.validiumsAndOptimiums)
                  : EM_DASH}
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </ChartTooltipWrapper>
  )
}
