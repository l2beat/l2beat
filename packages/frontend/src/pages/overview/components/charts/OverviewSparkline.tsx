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

export type OverviewSparklineColor = 'pink' | 'cyan' | 'sky' | 'purple'

type SparklineHeight = 44 | 48 | 56 | 60 | 80 | 96 | 100 | 120 | 140 | 160

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
  height?: SparklineHeight
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
const HEIGHT_OVERRIDE: Record<SparklineHeight, string> = {
  44: '[&_.recharts-responsive-container]:!h-[44px] [&_.recharts-responsive-container]:!min-h-[44px]',
  48: '[&_.recharts-responsive-container]:!h-[48px] [&_.recharts-responsive-container]:!min-h-[48px]',
  56: '[&_.recharts-responsive-container]:!h-[56px] [&_.recharts-responsive-container]:!min-h-[56px]',
  60: '[&_.recharts-responsive-container]:!h-[60px] [&_.recharts-responsive-container]:!min-h-[60px]',
  80: '[&_.recharts-responsive-container]:!h-[80px] [&_.recharts-responsive-container]:!min-h-[80px]',
  96: '[&_.recharts-responsive-container]:!h-[96px] [&_.recharts-responsive-container]:!min-h-[96px]',
  100: '[&_.recharts-responsive-container]:!h-[100px] [&_.recharts-responsive-container]:!min-h-[100px]',
  120: '[&_.recharts-responsive-container]:!h-[120px] [&_.recharts-responsive-container]:!min-h-[120px]',
  140: '[&_.recharts-responsive-container]:!h-[140px] [&_.recharts-responsive-container]:!min-h-[140px]',
  160: '[&_.recharts-responsive-container]:!h-[160px] [&_.recharts-responsive-container]:!min-h-[160px]',
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
          <div className="mt-1 border-divider border-t pt-2 font-medium text-label-value-12 leading-snug text-secondary">
            <p className="text-pretty">
              <span className="text-primary">Rollups</span>{' '}
              <span className="tabular-nums text-primary">
                {breakdown.rollups !== null && breakdown.rollups !== undefined
                  ? formatValue(breakdown.rollups)
                  : EM_DASH}
              </span>
              <span> · </span>
              <span className="text-primary">Validiums & Optimiums</span>{' '}
              <span className="tabular-nums text-primary">
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
