import { assert } from '@l2beat/shared-pure'
import {
  Bar,
  BarChart,
  CartesianGrid,
  DefaultZIndexes,
  XAxis,
  type XAxisTickContentProps,
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
import type { TransferSizeDataPoint } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { transferSizeBuckets } from '../../../utils/transferSizeBuckets'

interface Props {
  data: TransferSizeDataPoint[]
  isLoading: boolean
  horizontal?: boolean
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

export function TransferSizeChart({
  data,
  isLoading,
  horizontal = false,
}: Props) {
  const isClient = useIsClient()

  if (isLoading || !isClient) {
    return (
      <Skeleton
        className={cn('h-full w-full', !horizontal && 'mt-5 min-h-[250px]')}
      />
    )
  }

  return (
    <div className="relative size-full">
      <SimpleChartContainer meta={chartMeta}>
        <BarChart
          responsive
          width="100%"
          data={data}
          layout={horizontal ? 'vertical' : undefined}
          margin={
            horizontal ? { top: 4, right: 8, bottom: 4, left: 4 } : { top: 20 }
          }
          maxBarSize={horizontal ? undefined : 24}
          barSize={horizontal ? 10 : undefined}
          barGap={horizontal ? undefined : 4}
          barCategoryGap={horizontal ? 6 : undefined}
          className={cn(
            'size-full md:aspect-auto [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:fill-secondary! [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:font-bold! [&_.recharts-yAxis-tick-labels_.recharts-cartesian-axis-tick-label_text]:text-subtitle-11!',
            !horizontal && 'min-h-[250px]!',
          )}
        >
          <ChartLegend
            verticalAlign={horizontal ? 'bottom' : 'top'}
            align={horizontal ? 'center' : 'left'}
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
            vertical={horizontal}
            horizontal={!horizontal}
            strokeDasharray="5 5"
            zIndex={DefaultZIndexes.line + 1}
          />
          {horizontal ? (
            <XAxis
              type="number"
              domain={[0, 100]}
              tickCount={5}
              axisLine={false}
              tickLine={false}
              unit="%"
              allowDataOverflow={true}
            />
          ) : (
            <XAxis
              tickLine={false}
              dataKey="name"
              type="category"
              interval={0}
              tick={(props) => <CategoryXAxisTick {...props} data={data} />}
            />
          )}
          {horizontal ? (
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={0}
              width={70}
              tick={(props) => <CategoryYAxisTick {...props} data={data} />}
            />
          ) : (
            <YAxis
              tickCount={5}
              axisLine={false}
              tickLine={false}
              width={30}
              dx={5}
              unit="%"
              domain={[0, 100]}
              allowDataOverflow={true}
            />
          )}
          <ChartTooltip
            filterNull={false}
            content={<CustomTooltip horizontal={horizontal} />}
            allowEscapeViewBox={horizontal ? { x: true } : { y: true }}
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

function CategoryXAxisTick({
  x,
  y,
  payload,
  data,
}: XAxisTickContentProps & {
  data: TransferSizeDataPoint[]
}) {
  const item = data.find((item) => item.name === payload.value)
  assert(item, 'Item not found')
  return (
    <image
      x={x}
      y={y}
      className="-translate-x-1.5 sm:-translate-x-2.5 xs:-translate-x-2 size-3 xs:size-4 sm:size-5"
      href={item.iconUrl}
    >
      <title>{item.name}</title>
    </image>
  )
}

function CategoryYAxisTick({
  x,
  y,
  payload,
  data,
}: YAxisTickContentProps & {
  data: TransferSizeDataPoint[]
}) {
  const item = data.find((item) => item.name === payload.value)
  assert(item, 'Item not found')
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <image x={-66} y={-7} width={14} height={14} href={item.iconUrl}>
        <title>{item.name}</title>
      </image>
      <text
        x={-48}
        dy="0.32em"
        className="fill-primary font-bold text-subtitle-14"
      >
        {item.name}
      </text>
    </g>
  )
}

const percentageToCountKey: Record<
  Extract<keyof TransferSizeDataPoint, `percentage${string}`>,
  Extract<keyof TransferSizeDataPoint, `count${string}`>
> = {
  percentageUnder100: 'countUnder100',
  percentage100To1K: 'count100To1K',
  percentage1KTo10K: 'count1KTo10K',
  percentage10KTo100K: 'count10KTo100K',
  percentageOver100K: 'countOver100K',
}

function CustomTooltip({
  payload,
  label,
  horizontal,
}: CustomChartTooltipProps & { horizontal: boolean }) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'string' || !payload[0]) return null

  const data = payload[0].payload as TransferSizeDataPoint

  const totalTransfers =
    data.countUnder100 +
    data.count100To1K +
    data.count1KTo10K +
    data.count10KTo100K +
    data.countOver100K

  // Vertical bars stack bottom-to-top; reverse to match visual order.
  const orderedPayload = horizontal ? payload : [...payload].reverse()

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {label}
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
        {orderedPayload.map((entry, index) => {
          const configEntry = entry.name ? meta[entry.name] : undefined
          if (!configEntry || entry.hide) return null

          const countKey = entry.name
            ? percentageToCountKey[
                entry.name as Extract<
                  keyof TransferSizeDataPoint,
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
