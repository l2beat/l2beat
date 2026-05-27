import {
  CartesianGrid,
  DefaultZIndexes,
  ReferenceArea,
  XAxis,
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
  yAxis?: YAxisProps
  chartType?: 'bar' | 'line'
  isLoading: boolean | undefined
  syncedUntil: number | undefined
  hideXAxis?: boolean
}

export function ChartCommonComponents<T extends { timestamp: number }>({
  data,
  yAxis,
  isLoading,
  chartType = 'line',
  syncedUntil,
  hideXAxis = false,
}: ChartCommonComponentsProps<T>) {
  const {
    tickCount,
    yAxisId,
    tick: yAxisTick = { width: 350 },
    ...rest
  } = yAxis ?? {}
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
        tick={yAxisTick}
        yAxisId={yAxisId}
        {...rest}
      />
      {hideXAxis ? (
        <XAxis key="x-axis" dataKey="timestamp" hide />
      ) : (
        <XAxis key="x-axis" {...getXAxisProps(data)} />
      )}
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
