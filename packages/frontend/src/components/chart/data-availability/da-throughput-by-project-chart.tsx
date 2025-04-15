'use client'

import { assert } from '@l2beat/shared-pure'
import { sum, uniq } from 'lodash'
import { useMemo } from 'react'
import { Bar, BarChart, type TooltipProps } from 'recharts'

import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './get-da-data-params'

export function DaThroughputByProjectChart({ daLayer }: { daLayer: string }) {
  const { data, isLoading } = api.da.projectChartByProject.useQuery({
    range: '7d',
    daLayer,
  })

  const max = useMemo(() => {
    return data
      ? Math.max(...data.chart.map(([_, values]) => sum(Object.values(values))))
      : undefined
  }, [data])
  const { denominator, unit } = getDaDataParams(max)

  const allProjectSlugs = useMemo(() => {
    return uniq(
      data?.chart.flatMap(([_, values]) => {
        return Object.keys(values)
      }),
    ).slice(0, 8)
  }, [data])

  const chartMeta = useMemo(() => {
    return allProjectSlugs?.reduce((acc, slug) => {
      if (!acc[slug]) {
        acc[slug] = {
          label: slug,
          color: ['red', 'green', 'blue'][Math.floor(Math.random() * 3)]!,
          indicatorType: { shape: 'square' },
        }
      }

      return acc
    }, {} as ChartMeta)
  }, [allProjectSlugs])

  const chartData = useMemo(() => {
    return data?.chart.map(([timestamp, values]) => {
      return {
        timestamp: timestamp,
        ...Object.fromEntries(
          Object.entries(values)
            .map(([key, value]) => {
              if (!allProjectSlugs.includes(key)) return
              return [key, value / denominator] as const
            })
            .filter((v) => v !== undefined),
        ),
      }
    })
  }, [data?.chart, denominator, allProjectSlugs])

  return (
    <ChartContainer data={chartData} meta={chartMeta} isLoading={isLoading}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20 }}
        barCategoryGap={4}
      >
        <ChartLegend content={<ChartLegendContent />} />
        {allProjectSlugs?.map((slug) => (
          <Bar
            key={slug}
            dataKey={slug}
            stackId="a"
            fill={chartMeta?.[slug]?.color}
          />
        ))}

        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: ` ${unit}`,
            tickCount: 3,
            tick: {
              width: 100,
            },
          },
        })}
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
      </BarChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
  const { meta: config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="text-secondary">
        {formatTimestamp(label, { longMonthName: true })}
      </div>
      <HorizontalSeparator className="my-1" />
      <div>
        {payload.map((entry, index) => {
          if (entry.type === 'none') return null
          const configEntry = entry.name ? config[entry.name] : undefined
          assert(configEntry, 'Config entry not found')
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
                <span className="text-secondary">{configEntry.label}</span>
              </div>
              <span className="font-medium tabular-nums text-primary">
                {entry.value?.toFixed(2)} {unit}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
