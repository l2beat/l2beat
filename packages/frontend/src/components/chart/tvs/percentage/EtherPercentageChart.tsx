import round from 'lodash/round'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatTimestamp } from '~/utils/dates'

interface Props {
  data: [number, Record<string, number>][] | undefined
  isLoading: boolean
  syncedUntil: number | undefined
}
export function EtherPercentageChart({ data, isLoading, syncedUntil }: Props) {
  const allTokens = useMemo(() => {
    return data
      ? uniq(
          [...data]
            .reverse()
            .flatMap(([_, values]) => Object.keys(values ?? {})),
        )
      : []
  }, [data])

  const chartMeta = useMemo(() => {
    let index = 1
    return allTokens.reduce((acc, token) => {
      acc[token] = {
        label: token,
        color:
          token === 'ETH'
            ? 'var(--chart-ethereum)'
            : `var(--chart-ether-${index++})`,
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {} as ChartMeta)
  }, [allTokens])
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)

  const chartData = useMemo(() => {
    return data?.map(([timestamp, etherValues]) => {
      const toSum = Object.entries(etherValues)
        .filter(([token, value]) => {
          return dataKeys.includes(token) && value !== null
        })
        .map(([_, value]) => value)

      const total = toSum.reduce((acc, curr) => acc + curr, 0)

      if (total === 0) {
        return {
          timestamp: timestamp,
          // TODO: Can this be null?
          ...Object.fromEntries(
            Object.entries(etherValues).map(([token, value]) => {
              return [token, value !== null ? 0 : null]
            }),
          ),
        }
      }
      return {
        timestamp: timestamp,
        ...Object.fromEntries(
          Object.entries(etherValues).map(([token, value]) => {
            return [
              token,
              value !== null ? round((value / total) * 100, 2) : null,
            ]
          }),
        ),
      }
    })
  }, [data, dataKeys])

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20 }}
        barCategoryGap={0}
      >
        <ChartLegend content={<ChartLegendContent />} />
        {allTokens?.map((token) => (
          <Area
            key={token}
            dataKey={token}
            stackId="a"
            hide={!dataKeys.includes(token)}
            fill={chartMeta?.[token]?.color}
            fillOpacity={1}
            isAnimationActive={false}
            strokeWidth={0}
            activeDot={false}
            type="step"
          />
        ))}
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: '%',
            // To avoid showing 100.000001% we specify domain manually
            domain: [0, 100],
            // And allow data overflow to avoid Y Axis labels being off
            allowDataOverflow: true,
          },
          chartType: 'bar',
          syncedUntil,
        })}
        <ChartTooltip filterNull={false} content={<CustomTooltip />} />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(label, {
          mode: 'datetime',
        })}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? meta[entry.name] : undefined
          if (!configEntry || entry.hide) return null

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  backgroundColor={configEntry.color}
                  type={configEntry.indicatorType}
                />
                <span className="font-medium text-label-value-14">
                  {configEntry.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.value !== null && entry.value !== undefined
                  ? `${entry.value?.toFixed(2)}%`
                  : 'No data'}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
