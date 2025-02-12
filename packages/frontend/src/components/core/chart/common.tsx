import { CartesianGrid, XAxis, YAxis, type YAxisProps } from 'recharts'
import { getXAxisProps } from './get-x-axis-props'

export interface CommonChartComponentsProps<
  T extends {
    timestamp: number
  },
> {
  chartData: T[] | undefined
  yAxis?: YAxisProps
}

export function getCommonChartComponents<T extends { timestamp: number }>({
  chartData,
  yAxis,
}: CommonChartComponentsProps<T>) {
  return [
    <CartesianGrid key={'cartesian-grid'} vertical={false} />,
    <YAxis
      key={'y-axis'}
      tickLine={false}
      axisLine={false}
      mirror
      tickCount={3}
      dy={-10}
      {...yAxis}
    />,
    <XAxis key={'x-axis'} {...getXAxisProps(chartData)} />,
  ]
}
