import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
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

const MARGIN = { top: 14, right: 1, bottom: 18, left: 1 }

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

  // The chart is absolutely positioned inside the relative wrapper so the
  // rendered svg never contributes to the grid row's height.
  return (
    <div className="relative h-full min-h-[120px]">
      <div className="absolute inset-0 [&>div]:h-full">
        <ChartContainer
          meta={meta}
          data={data}
          isLoading={isLoading}
          size="small"
        >
          <TimeSeriesChart
            data={data}
            series={[
              { key: 'value', stroke, fill: CHART_GRADIENTS[color].fill },
              ...(withEthereum
                ? [
                    {
                      key: 'ethereum' as const,
                      stroke: STROKE_COLOR.ethereum,
                      fill: CHART_GRADIENTS.ethereum.fill,
                    },
                  ]
                : []),
            ]}
            ariaLabel={tooltipLabel}
            margin={MARGIN}
            syncedUntil={syncedUntil}
            yAxis={{
              format: formatValue,
              unit: yAxisUnit,
              dy: -8,
              fontSize: 12,
              fontWeight: 500,
            }}
            renderTooltip={(row, keys) => (
              <HomeChartTooltip
                row={row}
                keys={keys}
                formatValue={formatValue}
                dayRange={tooltipDayRange}
              />
            )}
          />
        </ChartContainer>
      </div>
    </div>
  )
}

function HomeChartTooltip({
  row,
  keys,
  formatValue,
  dayRange,
}: {
  row: HomeChartDataPoint
  keys: ('value' | 'ethereum')[]
  formatValue: (value: number) => string
  dayRange?: boolean
}) {
  const label = row.timestamp
  const entries = getTooltipEntries(row, keys)
  const breakdown = row.tvsBreakdown
  return (
    <ChartTooltipWrapper>
      <div className="flex w-50 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {dayRange
            ? formatRange(label, label + UnixTime.DAY)
            : formatTimestamp(label)}
        </div>
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={entry.value}
                format={formatValue}
                className="tabular-nums"
              />
            </ChartTooltipRow>
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
                  <ChartTooltipValue
                    value={item.value}
                    format={formatValue}
                    className="tabular-nums"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
