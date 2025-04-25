import { CartesianGrid, XAxis, YAxis, type YAxisProps } from 'recharts'
import type { ScaleType } from 'recharts/types/util/types'
import { getXAxisProps } from './get-x-axis-props'
export interface CommonChartComponentsProps<
  T extends {
    timestamp: number
  },
> {
  data: T[] | undefined
  yAxis?: Omit<YAxisProps, 'scale'> & { scale?: 'log' | 'lin' }
  isLoading: boolean | undefined
}

// Recharts 2.x does not support wrapping its components, so to solve it we need to return an array of components
// It will be possible in upcoming version 3.0 but for now we need to do it this way
export function getCommonChartComponents<T extends { timestamp: number }>({
  data,
  yAxis,
  isLoading,
}: CommonChartComponentsProps<T>) {
  const { scale, ...rest } = yAxis ?? {}

  return [
    <CartesianGrid
      key={'cartesian-grid'}
      vertical={false}
      syncWithTicks={!isLoading}
    />,
    <YAxis
      key={'y-axis'}
      tickLine={false}
      axisLine={false}
      mirror
      tickCount={3}
      dy={-10}
      // It requires a type cast to avoid type error
      // I have checked their code and although symlog is not correct by the type definition,
      // it is supported cuz they are getting actual scale function from d3-scale by using this string as a key
      // https://github.com/recharts/recharts/blob/master/src/util/ChartUtils.ts#L772
      {...(scale === 'log' ? { scale: 'symlog' as ScaleType } : {})}
      {...rest}
    />,
    <XAxis key={'x-axis'} {...getXAxisProps(data)} />,
  ]
}
