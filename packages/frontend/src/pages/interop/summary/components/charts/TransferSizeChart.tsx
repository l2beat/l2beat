import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  SimpleChartContainer,
} from '~/components/core/chart/Chart'

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

export function TransferSizeChart({ data, isLoading }: Props) {
  const chartMeta = useMemo(
    () =>
      ({
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
      }) satisfies ChartMeta,
    [],
  )

  return (
    <SimpleChartContainer meta={chartMeta} className="h-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20 }}
        barCategoryGap={6}
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
        <ChartTooltip filterNull={false} />
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
    />
  )
}
