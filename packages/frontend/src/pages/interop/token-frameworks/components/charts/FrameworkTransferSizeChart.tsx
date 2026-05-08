import { assert } from '@l2beat/shared-pure'
import {
  Bar,
  BarChart,
  CartesianGrid,
  DefaultZIndexes,
  XAxis,
  YAxis,
  type YAxisTickContentProps,
} from 'recharts'
import {
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  type CustomChartTooltipProps,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { Logo } from '~/components/Logo'
import { EM_DASH } from '~/consts/characters'
import { useIsClient } from '~/hooks/useIsClient'
import type { FrameworkTransferSizeDataPoint } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { transferSizeBuckets } from '../../../utils/transferSizeBuckets'

interface Props {
  data: FrameworkTransferSizeDataPoint[]
  isLoading: boolean
}

const chartMeta = {
  percentageUnder100: {
    label: transferSizeBuckets.under100.label,
    color: transferSizeBuckets.under100.color,
    indicatorType: { shape: 'square' },
  },
  percentage100To1K: {
    label: transferSizeBuckets.from100To1K.label,
    color: transferSizeBuckets.from100To1K.color,
    indicatorType: { shape: 'square' },
  },
  percentage1KTo10K: {
    label: transferSizeBuckets.from1KTo10K.label,
    color: transferSizeBuckets.from1KTo10K.color,
    indicatorType: { shape: 'square' },
  },
  percentage10KTo100K: {
    label: transferSizeBuckets.from10KTo100K.label,
    color: transferSizeBuckets.from10KTo100K.color,
    indicatorType: { shape: 'square' },
  },
  percentageOver100K: {
    label: transferSizeBuckets.over100K.label,
    color: transferSizeBuckets.over100K.color,
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

export function FrameworkTransferSizeChart({ data, isLoading }: Props) {
  const isClient = useIsClient()

  if (isLoading || !isClient) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <div className="relative size-full">
      <SimpleChartContainer meta={chartMeta}>
        <BarChart
          responsive
          width="100%"
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 8, bottom: 4, left: 4 }}
          barSize={10}
          barCategoryGap={6}
          className="size-full md:aspect-auto [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:fill-secondary! [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:font-bold! [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:text-subtitle-11!"
        >
          <ChartLegend
            verticalAlign="bottom"
            align="center"
            content={<ChartLegendContent />}
          />
          {Object.keys(chartMeta).map((bucket) => {
            const actualKey = bucket as keyof typeof chartMeta
            return (
              <Bar
                key={actualKey}
                dataKey={actualKey}
                stackId="a"
                fill={chartMeta[actualKey].color}
                fillOpacity={0.8}
                isAnimationActive={false}
              />
            )
          })}
          <CartesianGrid
            horizontal={false}
            strokeDasharray="5 5"
            zIndex={DefaultZIndexes.line + 1}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickCount={5}
            axisLine={false}
            tickLine={false}
            unit="%"
            allowDataOverflow={true}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            interval={0}
            width={130}
            tick={(props) => <YAxisTick {...props} data={data} />}
          />
          <ChartTooltip
            filterNull={false}
            content={<CustomTooltip />}
            allowEscapeViewBox={{ x: true }}
          />
        </BarChart>
      </SimpleChartContainer>
      <Logo
        animated={false}
        className={cn(
          'pointer-events-none absolute right-3 bottom-10 h-8 w-20 opacity-50',
        )}
      />
    </div>
  )
}

function YAxisTick({
  x,
  y,
  payload,
  data,
}: YAxisTickContentProps & {
  data: FrameworkTransferSizeDataPoint[]
}) {
  const item = data.find((item) => item.name === payload.value)
  assert(item, 'Item not found')
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <foreignObject x={-126} y={-9} width={122} height={18} overflow="visible">
        <div className="flex h-full items-center gap-1">
          <img
            src={item.iconUrl}
            alt={item.name}
            className="size-3.5 shrink-0 rounded-full"
          />
          {item.frameworkLabel ? (
            <span className="truncate text-secondary text-subtitle-11">
              <span className="font-bold">{item.frameworkLabel}</span>{' '}
              <span className="font-medium">{item.name}</span>
            </span>
          ) : (
            <span className="truncate font-bold text-secondary text-subtitle-11">
              {item.name}
            </span>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

const percentageToCountKey: Record<
  Extract<keyof FrameworkTransferSizeDataPoint, `percentage${string}`>,
  Extract<keyof FrameworkTransferSizeDataPoint, `count${string}`>
> = {
  percentageUnder100: 'countUnder100',
  percentage100To1K: 'count100To1K',
  percentage1KTo10K: 'count1KTo10K',
  percentage10KTo100K: 'count10KTo100K',
  percentageOver100K: 'countOver100K',
}

function CustomTooltip({ payload, label }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'string' || !payload[0]) return null

  const data = payload[0].payload as FrameworkTransferSizeDataPoint

  const totalTransfers =
    data.countUnder100 +
    data.count100To1K +
    data.count1KTo10K +
    data.count10KTo100K +
    data.countOver100K

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {data.frameworkLabel ? `${data.frameworkLabel} ${label}` : label}
      </div>

      <HorizontalSeparator className="my-1.5" />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">
            Total identified transfers
          </span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatInteger(totalTransfers)} transfers
          </span>
        </div>
        {payload.map((entry, index) => {
          const configEntry = entry.name ? meta[entry.name] : undefined
          if (!configEntry || entry.hide) return null

          const countKey = entry.name
            ? percentageToCountKey[
                entry.name as Extract<
                  keyof FrameworkTransferSizeDataPoint,
                  `percentage${string}`
                >
              ]
            : undefined
          const count = countKey ? (data[countKey] as number) : 0

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
                {formatInteger(count)} transfers
              </span>
            </div>
          )
        })}
      </div>
      <HorizontalSeparator className="my-1.5" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Min size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(data.minTransferValueUsd)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Average size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(data.averageTransferSizeUsd)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Max size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(data.maxTransferValueUsd)}
          </span>
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function formatTransferSize(value: number | undefined) {
  return value !== undefined ? formatCurrency(value, 'usd') : EM_DASH
}
