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
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { PinkFillGradientDef } from '~/components/core/chart/defs/PinkGradientDef'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatRange, formatTimestamp } from '~/utils/dates'

export type HomeChartColor = 'pink' | 'ethereum'

export interface HomeChartDataPoint {
  timestamp: number
  value: number | null
  ethereum?: number | null
  tvsBreakdown?: {
    rollups: number | null
    validiumsAndOptimiums: number | null
  }
}

interface Props {
  data: HomeChartDataPoint[] | undefined
  isLoading: boolean
  color: HomeChartColor
  tooltipLabel: string
  formatValue: (value: number) => string
  yAxisUnit?: string
  syncedUntil?: number
  tooltipDayRange?: boolean
  withEthereum?: boolean
}

const STROKE_COLOR: Record<HomeChartColor, string> = {
  pink: 'var(--chart-pink)',
  ethereum: 'var(--chart-ethereum)',
}

/**
 * The chart is absolutely positioned inside the relative wrapper so the
 * rendered svg (fixed pixel height) never contributes to layout height —
 * otherwise a transiently tall grid row makes the chart render taller, which
 * then holds the row at that height forever (ratchets up on window resize).
 */
const FILL_HEIGHT_CLASS =
  'absolute inset-0 [&>div]:h-full [&_.recharts-wrapper]:h-full! [&_.recharts-wrapper]:min-h-0! [&_.recharts-wrapper]:aspect-auto!'

const Y_AXIS_TICK_SIZE_CLASS =
  '[&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!text-2xs [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!font-medium [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:!leading-none'

const X_AXIS_PROPS = {
  height: 18,
  tickMargin: 3,
} as const

export function HomeChart({
  data,
  isLoading,
  color,
  tooltipLabel,
  formatValue,
  yAxisUnit,
  syncedUntil,
  tooltipDayRange,
  withEthereum,
}: Props) {
  const fillId = useId()
  const ethereumFillId = useId()

  const stroke = STROKE_COLOR[color]
  const meta = useMemo<ChartMeta>(
    () => ({
      value: {
        label: tooltipLabel,
        color: stroke,
        indicatorType: { shape: 'line' },
      },
      ...(withEthereum
        ? {
            ethereum: {
              label: 'Ethereum',
              color: STROKE_COLOR.ethereum,
              indicatorType: { shape: 'line' as const },
            },
          }
        : {}),
    }),
    [stroke, tooltipLabel, withEthereum],
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
              {color === 'ethereum' && <EthereumFillGradientDef id={fillId} />}
              {withEthereum && <EthereumFillGradientDef id={ethereumFillId} />}
            </defs>
            <Area
              dataKey="value"
              stroke={stroke}
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
            {withEthereum && (
              <Area
                dataKey="ethereum"
                stroke={STROKE_COLOR.ethereum}
                fill={`url(#${ethereumFillId})`}
                fillOpacity={1}
                dot={false}
                isAnimationActive={false}
                connectNulls={false}
                activeDot={{
                  r: 3,
                  stroke: '#fff',
                  strokeWidth: 1,
                  fill: STROKE_COLOR.ethereum,
                }}
              />
            )}
            <ChartCommonComponents
              data={data}
              isLoading={isLoading}
              xAxis={X_AXIS_PROPS}
              yAxis={{ tickFormatter: formatValue, unit: yAxisUnit, dy: -8 }}
              syncedUntil={syncedUntil}
            />
            <ChartTooltip
              content={
                <HomeChartTooltip
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

function HomeChartTooltip({
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
  const entries = payload.flatMap((entry) => {
    if (entry.name === undefined) return []
    const config = meta[entry.name]
    if (!config) return []
    return { entry, config }
  })
  const firstEntry = entries[0]
  if (!firstEntry) return null
  const row = firstEntry.entry.payload as HomeChartDataPoint | undefined
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
          {entries.map(({ entry, config }) => (
            <div
              key={entry.name}
              className="flex w-full items-center justify-between gap-2"
            >
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
          ))}
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
