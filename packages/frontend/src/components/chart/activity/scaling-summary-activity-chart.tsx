'use client'

import { UnixTime } from '@l2beat/shared-pure'
import Link from 'next/link'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/ethereum-gradient-def'
import {
  OthersFillGradientDef,
  OthersStrokeGradientDef,
} from '~/components/core/chart/defs/others-gradient-def'
import {
  RollupsFillGradientDef,
  RollupsStrokeGradientDef,
} from '~/components/core/chart/defs/rollups-gradient-def'
import {
  ValidiumsAndOptimiumsFillGradientDef,
  ValidiumsAndOptimiumsStrokeGradientDef,
} from '~/components/core/chart/defs/validiums-and-optimiums-gradient-def'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Skeleton } from '~/components/core/skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { CustomLink } from '~/components/link/custom-link'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { ChevronIcon } from '~/icons/chevron'
import type { ActivityChartStats } from '~/server/features/scaling/activity/get-activity-chart-stats'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { formatInteger } from '~/utils/number-format/format-integer'

interface Props {
  timeRange: ActivityTimeRange
}

const chartConfig = {
  rollups: {
    label: 'Rollups',
    color: 'hsl(var(--chart-rollups))',
  },
  validiumsAndOptimiums: {
    label: 'Validiums and Optimiums',
    color: 'hsl(var(--chart-validiums-optimiums))',
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--chart-others))',
  },
  ethereum: {
    label: 'Ethereum',
    color: 'hsl(var(--chart-ethereum))',
  },
} satisfies ChartConfig

export function ScalingSummaryActivityChart({ timeRange }: Props) {
  const { checked } = useRecategorisationPreviewContext()
  const { data: stats } = api.activity.chartStats.useQuery({
    filter: { type: 'all' },
    previewRecategorisation: checked,
  })
  const { data, isLoading } = api.activity.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
    previewRecategorisation: checked,
  })

  const chartData = useMemo(() => {
    return data?.data.map(
      ([timestamp, rollups, validiumsAndOptimiums, others, ethereum]) => {
        return {
          timestamp,
          rollups: countPerSecond(rollups),
          validiumsAndOptimiums: countPerSecond(validiumsAndOptimiums),
          others: countPerSecond(others),
          ethereum: countPerSecond(ethereum),
        }
      },
    )
  }, [data])

  return (
    <section className="flex flex-col gap-4">
      <Header stats={stats} />
      <ChartContainer
        config={chartConfig}
        data={chartData}
        isLoading={isLoading}
      >
        <AreaChart data={chartData} margin={{ top: 20 }}>
          <defs>
            <RollupsFillGradientDef id="rollups-fill" />
            <RollupsStrokeGradientDef id="rollups-stroke" />
            <ValidiumsAndOptimiumsFillGradientDef id="validiums-and-optimiums-fill" />
            <ValidiumsAndOptimiumsStrokeGradientDef id="validiums-and-optimiums-stroke" />
            <OthersFillGradientDef id="others-fill" />
            <OthersStrokeGradientDef id="others-stroke" />
            <EthereumFillGradientDef id="ethereum-fill" />
            <EthereumStrokeGradientDef id="ethereum-stroke" />
          </defs>
          <ChartLegend content={<ChartLegendContent />} />
          <ChartTooltip
            content={<CustomTooltip syncedUntil={data?.syncedUntil} />}
          />
          <Area
            dataKey="rollups"
            stroke="url(#rollups-stroke)"
            fill="url(#rollups-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            dataKey="validiumsAndOptimiums"
            stroke="url(#validiums-and-optimiums-stroke)"
            fill="url(#validiums-and-optimiums-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            dataKey="others"
            stroke="url(#others-stroke)"
            fill="url(#others-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            dataKey="ethereum"
            stroke="url(#ethereum-stroke)"
            fill="url(#ethereum-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            chartData,
            yAxis: {
              unit: ' UOPS',
              tick: {
                width: 100,
              },
            },
          })}
        </AreaChart>
      </ChartContainer>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label: timestamp,
  syncedUntil,
}: TooltipProps<number, string> & { syncedUntil: number | undefined }) {
  if (!active || !payload || typeof timestamp !== 'number') return null
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex w-40 flex-col gap-1 sm:w-60">
        <div className="mb-1 whitespace-nowrap">
          {formatTimestamp(timestamp, {
            longMonthName: true,
          })}
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-secondary">Average UOPS</span>
          </div>
        </div>
        <HorizontalSeparator className="mb-1" />
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = chartConfig[entry.name as keyof typeof chartConfig]
            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="relative inline-block size-3 rounded"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-bold tabular-nums">
                  {syncedUntil && syncedUntil < timestamp
                    ? 'Not synced'
                    : formatActivityCount(entry.value)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-secondary">Operations count</span>
          </div>
        </div>
        <HorizontalSeparator className="mb-1" />
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = chartConfig[entry.name as keyof typeof chartConfig]
            return (
              <div
                key={entry.name}
                className="flex w-full items-start justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="relative inline-block size-3 rounded"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-bold tabular-nums">
                  {syncedUntil && syncedUntil < timestamp
                    ? 'Not synced'
                    : formatInteger(entry.value * UnixTime.DAY)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Header({ stats }: { stats: ActivityChartStats | undefined }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Activity</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 text-[13px] font-bold leading-none text-link max-md:hidden"
            href="/scaling/activity"
          >
            View details
            <ChevronIcon className="size-[10px] -rotate-90 fill-current" />
          </Link>
        </div>
        <CustomLink
          href="/scaling/activity"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="size-[10px] -rotate-90 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        {stats !== undefined ? (
          <>
            <div className="whitespace-nowrap text-right text-xl font-bold">
              {formatActivityCount(
                countPerSecond(stats.uops.latestProjectsTxCount),
              )}{' '}
              UOPS
            </div>
            <div className="h-5" />
          </>
        ) : (
          <>
            <Skeleton className="my-[5px] h-5 w-20 md:w-[243px]" />
            <div className="h-5" />
          </>
        )}
      </div>
    </div>
  )
}
