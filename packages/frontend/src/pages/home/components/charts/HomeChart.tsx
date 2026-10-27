import { UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
import { type ChartMeta, useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { PinkFillGradientDef } from '~/components/core/chart/defs/PinkGradientDef'
import { TsChartContainer } from '~/components/core/chart/tanstack/TsChartContainer'
import {
  TsChartTooltipWrapper,
  type TsSeries,
  TsTimeSeriesChart,
} from '~/components/core/chart/tanstack/TsTimeSeriesChart'
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

  const series = useMemo(() => {
    const result: TsSeries<'value' | 'ethereum'>[] = [
      { key: 'value', stroke, fill: `url(#${fillId})` },
    ]
    if (withEthereum) {
      result.push({
        key: 'ethereum',
        stroke: STROKE_COLOR.ethereum,
        fill: `url(#${ethereumFillId})`,
      })
    }
    return result
  }, [stroke, fillId, ethereumFillId, withEthereum])

  // The chart is absolutely positioned inside the relative wrapper so the
  // rendered svg never contributes to the grid row's height.
  return (
    <div className="relative h-full min-h-[120px]">
      <div className="absolute inset-0 [&>div]:h-full">
        <TsChartContainer
          meta={meta}
          data={data}
          isLoading={isLoading}
          size="small"
        >
          <TsTimeSeriesChart
            data={data}
            series={series}
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
            defs={
              <>
                {color === 'pink' && <PinkFillGradientDef id={fillId} />}
                {color === 'ethereum' && (
                  <EthereumFillGradientDef id={fillId} />
                )}
                {withEthereum && (
                  <EthereumFillGradientDef id={ethereumFillId} />
                )}
              </>
            }
            renderTooltip={(row, keys) => (
              <HomeChartTooltip
                row={row}
                keys={keys}
                formatValue={formatValue}
                dayRange={tooltipDayRange}
              />
            )}
          />
        </TsChartContainer>
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
  const { meta } = useChart()
  const label = row.timestamp
  const entries = keys.flatMap((name) => {
    const config = meta[name]
    if (!config) return []
    return { entry: { name, value: row[name] }, config }
  })
  const breakdown = row.tvsBreakdown
  return (
    <TsChartTooltipWrapper>
      <div className="flex w-50 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {dayRange
            ? formatRange(label, label + UnixTime.DAY)
            : formatTimestamp(label)}
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
    </TsChartTooltipWrapper>
  )
}
