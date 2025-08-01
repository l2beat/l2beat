import {
  CartesianGrid,
  ReferenceArea,
  XAxis,
  YAxis,
  type YAxisProps,
} from 'recharts'
import type { ScaleType } from 'recharts/types/util/types'
import { NoDataPatternDef } from '../defs/NoDataPatternDef'
import { getXAxisProps } from './getXAxisProps'

interface CommonChartComponentsProps<
  T extends {
    timestamp: number
  },
> {
  data: T[] | undefined
  yAxis?: Omit<YAxisProps, 'scale' | 'tick'> & { scale?: 'log' | 'lin' }
  chartType?: 'bar' | 'line'
  isLoading: boolean | undefined
  syncedUntil: number | undefined
}

// Recharts 2.x does not support wrapping its components, so to solve it we need to return an array of components
// It will be possible in upcoming version 3.0 but for now we need to do it this way
export function getCommonChartComponents<T extends { timestamp: number }>({
  data,
  yAxis,
  isLoading,
  chartType = 'line',
  syncedUntil,
}: CommonChartComponentsProps<T>) {
  const { scale, tickCount, ...rest } = yAxis ?? {}
  const lastSyncedTimestamp =
    syncedUntil &&
    (chartType === 'line'
      ? data?.findLast((d) => d.timestamp <= syncedUntil)
      : data?.find((d) => d.timestamp > syncedUntil)
    )?.timestamp

  return [
    <CartesianGrid
      key="cartesian-grid"
      vertical={false}
      syncWithTicks={!isLoading}
    />,
    <YAxis
      key="y-axis"
      tickLine={false}
      axisLine={false}
      mirror
      tickCount={tickCount ?? 3}
      dy={-10}
      // It requires a type cast to avoid type error
      // I have checked their code and although symlog is not correct by the type definition,
      // it is supported cuz they are getting actual scale function from d3-scale by using this string as a key
      // https://github.com/recharts/recharts/blob/master/src/util/ChartUtils.ts#L772
      {...(scale === 'log' ? { scale: 'symlog' as ScaleType } : {})}
      tick={{ width: 350 }}
      {...rest}
    />,
    <XAxis key="x-axis" {...getXAxisProps(data)} />,
    lastSyncedTimestamp && (
      <ReferenceArea
        yAxisId={yAxis?.yAxisId}
        key="last-valid-timestamp"
        x1={lastSyncedTimestamp}
        fill="url(#noDataFill)"
      />
    ),
    lastSyncedTimestamp && (
      <defs key="not-synced-defs">
        <NoDataPatternDef />
      </defs>
    ),
  ]
}
