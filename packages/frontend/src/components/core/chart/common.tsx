import { CartesianGrid, XAxis, YAxis, type YAxisProps } from 'recharts'
import { getXAxisProps } from './get-x-axis-props'

export function getCommonChartComponents<T extends { timestamp: number }>({
  chartData,
  yAxisProps,
}: {
  chartData: T[] | undefined
  yAxisProps?: YAxisProps
}) {
  return [
    <CartesianGrid key={'cartesian-grid'} vertical={false} />,
    <YAxis
      key={'y-axis'}
      tickLine={false}
      axisLine={false}
      mirror
      tickCount={3}
      dy={-10}
      {...yAxisProps}
    />,
    <XAxis key={'x-axis'} {...getXAxisProps(chartData)} />,
  ]
}
