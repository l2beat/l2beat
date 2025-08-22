import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/CyanGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import type { RecategorisedActivityChartData } from '~/server/features/scaling/activity/getRecategorisedActivityChart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface Props {
  timeRange: ActivityTimeRange
}

const chartMeta = {
  rollups: {
    label: 'Rollups',
    color: 'var(--chart-pink)',
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'var(--chart-cyan)',
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: 'var(--chart-yellow)',
    indicatorType: {
      shape: 'line',
    },
  },
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

const hiddenDataKeys = ['others'] as const

export function ScalingSummaryActivityChart({ timeRange }: Props) {
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    chartMeta,
    hiddenDataKeys,
  )

  const { data, isLoading } = api.activity.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const chartData = useMemo(() => {
    return data?.data.map(
      ([timestamp, rollups, validiumsAndOptimiums, others, ethereum]) => {
        return {
          timestamp,
          rollups: rollups !== null ? countPerSecond(rollups) : null,
          validiumsAndOptimiums:
            validiumsAndOptimiums !== null
              ? countPerSecond(validiumsAndOptimiums)
              : null,
          others: others !== null ? countPerSecond(others) : null,
          ethereum: ethereum !== null ? countPerSecond(ethereum) : null,
        }
      },
    )
  }, [data])

  const stats = getStats(data?.data, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <Header latestUopsCount={stats} />
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
          disableOnboarding: true,
        }}
      >
        <AreaChart data={chartData} margin={{ top: 20 }}>
          <defs>
            <PinkFillGradientDef id="rollups-fill" />
            <PinkStrokeGradientDef id="rollups-stroke" />
            <CyanFillGradientDef id="validiums-and-optimiums-fill" />
            <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
            <YellowFillGradientDef id="others-fill" />
            <YellowStrokeGradientDef id="others-stroke" />
            <EthereumFillGradientDef id="ethereum-fill" />
            <EthereumStrokeGradientDef id="ethereum-stroke" />
          </defs>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: [
              {
                dataKey: 'rollups',
                stroke: 'url(#rollups-stroke)',
                fill: 'url(#rollups-fill)',
                hide: !dataKeys.includes('rollups'),
              },
              {
                dataKey: 'validiumsAndOptimiums',
                stroke: 'url(#validiums-and-optimiums-stroke)',
                fill: 'url(#validiums-and-optimiums-fill)',
                hide: !dataKeys.includes('validiumsAndOptimiums'),
              },
              {
                dataKey: 'others',
                stroke: 'url(#others-stroke)',
                fill: 'url(#others-fill)',
                hide: !dataKeys.includes('others'),
              },
              {
                dataKey: 'ethereum',
                stroke: 'url(#ethereum-stroke)',
                fill: 'url(#ethereum-fill)',
                hide: !dataKeys.includes('ethereum'),
              },
            ],
          })}
          <ChartTooltip
            content={<CustomTooltip syncedUntil={data?.syncedUntil} />}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
              unit: ' UOPS',
            },
            syncedUntil: data?.syncedUntil,
          })}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  syncedUntil,
}: TooltipProps<number, string> & { syncedUntil: number | undefined }) {
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + UnixTime.DAY)}
        </div>
        <span className="text-heading-16">Average UOPS</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.type === 'none') return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            return (
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
                    ? formatActivityCount(entry.value)
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>

        <span className="mt-3 text-heading-16">Operations count</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (
              entry.value === undefined ||
              entry.value === null ||
              entry.type === 'none'
            )
              return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            return (
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
                  {syncedUntil && syncedUntil < label
                    ? 'No data'
                    : formatInteger(entry.value * UnixTime.DAY)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function Header({ latestUopsCount }: { latestUopsCount: number | undefined }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl">Activity</span>
          <a
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none max-md:hidden"
            href="/scaling/activity"
          >
            View details
            <ChevronIcon className="-rotate-90 size-[10px] fill-current" />
          </a>
        </div>
        <CustomLink
          href="/scaling/activity"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="-rotate-90 size-[10px] fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        {latestUopsCount !== undefined ? (
          <>
            <div className="whitespace-nowrap text-right font-bold text-xl">
              {formatActivityCount(countPerSecond(latestUopsCount))} UOPS
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

function getStats(
  data: RecategorisedActivityChartData['data'] | undefined,
  dataKeys: (keyof typeof chartMeta)[],
) {
  if (!data) {
    return undefined
  }

  const pointsWithData = data.filter(
    ([_, rollups, validiumsAndOptimiums, others, ethereum]) => {
      return (
        rollups !== null && validiumsAndOptimiums !== null && others !== null
      )
    },
  ) as [number, number, number, number, number | null][]
  const latestData = pointsWithData.at(-1)

  if (!latestData) {
    return undefined
  }

  const toSum = [
    dataKeys.includes('rollups') ? latestData[1] : 0,
    dataKeys.includes('validiumsAndOptimiums') ? latestData[2] : 0,
    dataKeys.includes('others') ? latestData[3] : 0,
  ]

  return toSum.reduce((acc, curr) => acc + curr, 0)
}
