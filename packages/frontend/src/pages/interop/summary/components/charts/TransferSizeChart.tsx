import { assert } from '@l2beat/shared-pure'
import {
  Bar,
  BarChart,
  CartesianGrid,
  type TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'

interface Props {
  data: TransferSizeDataPoint[] | undefined
  isLoading: boolean
}

type TransferSizeDataPoint = {
  name: string
  iconUrl: string
  countUnder100: number
  percentageUnder100: number
  count100To1K: number
  percentage100To1K: number
  count1KTo10K: number
  percentage1KTo10K: number
  count10KTo100K: number
  percentage10KTo100K: number
  countOver100K: number
  percentageOver100K: number
}

const chartMeta = {
  percentageUnder100: {
    label: 'Under $100',
    color: '#567FFF',
    indicatorType: { shape: 'square' },
  },
  percentage100To1K: {
    label: '$100-$1,000',
    color: '#7AE7C7',
    indicatorType: { shape: 'square' },
  },
  percentage1KTo10K: {
    label: '$1,000-$10,000',
    color: '#F7CB15',
    indicatorType: { shape: 'square' },
  },
  percentage10KTo100K: {
    label: '$10,000-$100,000',
    color: '#503047',
    indicatorType: { shape: 'square' },
  },
  percentageOver100K: {
    label: 'Over $100,000',
    color: '#F55D3E',
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

export function TransferSizeChart({ data, isLoading }: Props) {
  const isClient = useIsClient()
  if (isLoading || !isClient) {
    return <Skeleton className="mt-5 h-full w-full" />
  }

  return (
    <SimpleChartContainer meta={chartMeta} className="h-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20 }}
        maxBarSize={24}
        barGap={4}
      >
        <ChartLegend
          verticalAlign="top"
          align="left"
          content={<ChartLegendContent />}
        />
        {Object.keys(chartMeta).map((bucket) => {
          const actualKey = bucket as keyof typeof chartMeta
          return [
            <Bar
              key={actualKey}
              dataKey={actualKey}
              stackId="a"
              fill={chartMeta[actualKey].color}
              fillOpacity={1}
              isAnimationActive={false}
            />,
          ]
        })}
        <CartesianGrid vertical={false} strokeDasharray="5 5" x={0} />,
        <YAxis
          tickCount={5}
          tickLine={false}
          axisLine={false}
          dy={-10}
          dx={-10}
          unit="%"
          domain={[0, 100]}
          allowDataOverflow={true}
        />
        <XAxis
          tickLine={false}
          dataKey="name"
          type="category"
          interval={0}
          tick={(props) => <XAxisTick {...props} data={data} />}
        />
        <ChartTooltip filterNull={false} content={<CustomTooltip />} />
      </BarChart>
    </SimpleChartContainer>
  )
}

const IMAGE_SIZE = 20
function XAxisTick({
  x,
  y,
  payload,
  data,
}: {
  x: number
  y: number
  payload: { value: string }
  data: TransferSizeDataPoint[]
}) {
  const item = data.find((item) => item.name === payload.value)
  assert(item, 'Item not found')
  return (
    <image
      x={x - IMAGE_SIZE / 2}
      y={y}
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      href={item.iconUrl}
    >
      <title>{item.name}</title>
    </image>
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
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'string') return null

  const data = payload[0]?.payload as TransferSizeDataPoint

  // Calculate total transfers
  const totalTransfers =
    data.countUnder100 +
    data.count100To1K +
    data.count1KTo10K +
    data.count10KTo100K +
    data.countOver100K

  // Format number with commas
  const formatCount = (count: number): string => {
    return count.toLocaleString('en-US')
  }

  // To match with bar order
  const reversedPayload = [...payload].reverse()

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {label}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex flex-col gap-2">
        {reversedPayload.map((entry, index) => {
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
                {formatCount(count)} transfers
              </span>
            </div>
          )
        })}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex items-center justify-between gap-x-6">
        <span className="font-medium text-label-value-14">Total transfers</span>
        <span className="font-medium text-label-value-15 text-primary tabular-nums">
          {formatCount(totalTransfers)} transfers
        </span>
      </div>
    </ChartTooltipWrapper>
  )
}
