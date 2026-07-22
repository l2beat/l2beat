import { UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { CyanFillGradientDef } from '~/components/core/chart/defs/CyanGradientDef'
import { PinkFillGradientDef } from '~/components/core/chart/defs/PinkGradientDef'
import { SkyFillGradientDef } from '~/components/core/chart/defs/SkyGradientDef'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatRange, formatTimestamp } from '~/utils/dates'

export type HomeSparklineColor = 'pink' | 'cyan' | 'sky' | 'purple'

export interface HomeSparklineDataPoint {
  timestamp: number
  value: number | null
  /** If set, TVS tooltip shows rollups / Validiums & Optimiums for this day */
  tvsBreakdown?: {
    rollups: number | null
    validiumsAndOptimiums: number | null
  }
}

interface Props {
  data: HomeSparklineDataPoint[] | undefined
  isLoading: boolean
  color: HomeSparklineColor
  tooltipLabel: string
  formatValue: (value: number) => string
  /** Appended to y-axis tick labels (e.g. ' UOPS') when the formatted value
   * alone doesn't carry a unit. */
  yAxisUnit?: string
  syncedUntil?: number
  /** For period-aggregated metrics (activity, data posted): show the full day
   * range in the tooltip instead of a point-in-time date. */
  tooltipDayRange?: boolean
}

const STROKE_COLOR: Record<HomeSparklineColor, string> = {
  pink: 'var(--chart-pink)',
  cyan: 'var(--chart-cyan)',
  sky: 'var(--chart-sky)',
  purple: 'var(--chart-stacked-purple)',
}

/**
 * Grow to fill the parent's available height (parent must define a height).
 * The chart is absolutely positioned inside the relative wrapper so the
 * rendered svg (fixed pixel height) never contributes to layout height —
 * otherwise a transiently tall grid row makes the chart render taller, which
 * then holds the row at that height forever (ratchets up on window resize).
 */
const FILL_HEIGHT_CLASS =
  'absolute inset-0 [&>div]:h-full [&_.recharts-wrapper]:h-full! [&_.recharts-wrapper]:min-h-0! [&_.recharts-wrapper]:aspect-auto!'

/**
 * Compact-widget y-axis: the shared container styles ticks at text-sm for
 * full-size charts, which overpowers these small plots — step them down.
 */
const Y_AXIS_TICK_SIZE_CLASS =
  '[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!text-2xs [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!font-medium [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!leading-none'

/**
 * Compact x-axis: a short timeline strip that renders inside the chart height
 * (so the widget doesn't grow — the plot area just shrinks). Tick text is
 * already styled small by the shared ChartContainer.
 */
const X_AXIS_PROPS = {
  height: 18,
  tickMargin: 3,
} as const

/**
 * Sleek single-series line/area sparkline used inside the home widgets.
 * Wraps Recharts' AreaChart through `ChartContainer` (size="small") so we get
 * the shared loader / no-data state, but omits the legend slot. Fills the
 * parent's height, with a minimal mirrored y-axis and a compact timeline.
 */
export function HomeSparkline({
  data,
  isLoading,
  color,
  tooltipLabel,
  formatValue,
  yAxisUnit,
  syncedUntil,
  tooltipDayRange,
}: Props) {
  const fillId = useId()

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
    <div className="relative h-full min-h-[120px]">
      <div className={`${FILL_HEIGHT_CLASS} ${Y_AXIS_TICK_SIZE_CLASS}`}>
        <ChartContainer
          meta={meta}
          data={data}
          isLoading={isLoading}
          size="small"
        >
          <AreaChart
            responsive
            data={data}
            margin={{ top: 14, right: 1, bottom: 0, left: 1 }}
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
            <ChartCommonComponents
              data={data}
              isLoading={isLoading}
              xAxis={X_AXIS_PROPS}
              yAxis={{ tickFormatter: formatValue, unit: yAxisUnit, dy: -8 }}
              syncedUntil={syncedUntil}
            />
            <ChartTooltip
              content={
                <SparklineTooltip
                  formatValue={formatValue}
                  dayRange={tooltipDayRange}
                />
              }
              filterNull={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

function SparklineTooltip({
  payload,
  label,
  formatValue,
  dayRange,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  dayRange?: boolean
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null
  const entry = payload[0]
  if (!entry || entry.name === undefined) return null
  const config = meta[entry.name]
  if (!config) return null
  const row = entry.payload as HomeSparklineDataPoint | undefined
  const breakdown = row?.tvsBreakdown
  return (
    <ChartTooltipWrapper>
      <div className="flex w-50 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {dayRange
            ? formatRange(label, label + UnixTime.DAY)
            : formatTimestamp(label, { longMonthName: true })}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <ChartDataIndicator
                backgroundColor={config.color}
                type={config.indicatorType}
              />
              <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                {config.label}
              </span>
            </div>
            <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
              {entry.value !== null && entry.value !== undefined
                ? formatValue(entry.value)
                : 'No data'}
            </span>
          </div>
          {breakdown !== undefined && (
            <>
              <HorizontalSeparator />
              {[
                { label: 'Rollups', value: breakdown.rollups },
                {
                  label: 'Validiums & Optimiums',
                  value: breakdown.validiumsAndOptimiums,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {item.label}
                  </span>
                  <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                    {item.value !== null && item.value !== undefined
                      ? formatValue(item.value)
                      : 'No data'}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
