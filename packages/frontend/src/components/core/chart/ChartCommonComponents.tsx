import {
  CartesianGrid,
  DefaultZIndexes,
  ReferenceArea,
  XAxis,
  type XAxisProps,
  YAxis,
  type YAxisProps,
} from 'recharts'
import { NoDataPatternDef } from './defs/NoDataPatternDef'
import { getXAxisProps } from './utils/getXAxisProps'

export interface ChartCommonComponentsProps<
  T extends {
    timestamp: number
  },
> {
  data: T[] | undefined
  yAxis?: Omit<YAxisProps, 'tick'>
  xAxis?: Partial<XAxisProps>
  chartType?: 'bar' | 'line'
  isLoading: boolean | undefined
  syncedUntil: number | undefined
}

export function ChartCommonComponents<T extends { timestamp: number }>({
  data,
  yAxis,
  xAxis,
  isLoading,
  chartType = 'line',
  syncedUntil,
}: ChartCommonComponentsProps<T>) {
  const { tickCount, yAxisId, ...rest } = yAxis ?? {}
  const lastSyncedTimestamp =
    syncedUntil &&
    (chartType === 'line'
      ? data?.findLast((d) => d.timestamp <= syncedUntil)
      : data?.find((d) => d.timestamp > syncedUntil)
    )?.timestamp

  return (
    <>
      <CartesianGrid
        key="cartesian-grid"
        vertical={false}
        syncWithTicks={!isLoading}
        yAxisId={yAxisId}
        zIndex={DefaultZIndexes.line + 1}
      />
      <YAxis
        key="y-axis"
        tickLine={false}
        axisLine={false}
        mirror
        tickCount={tickCount ?? 3}
        dy={-10}
        tick={{ width: 350 }}
        yAxisId={yAxisId}
        {...rest}
      />
      <XAxis key="x-axis" {...getXAxisProps(data)} {...xAxis} />
      {lastSyncedTimestamp && (
        <ReferenceArea
          yAxisId={yAxis?.yAxisId}
          key="last-valid-timestamp"
          x1={lastSyncedTimestamp}
          fill="url(#noDataFill)"
        />
      )}
      {lastSyncedTimestamp && (
        <defs key="not-synced-defs">
          <NoDataPatternDef />
        </defs>
      )}
    </>
  )
}
