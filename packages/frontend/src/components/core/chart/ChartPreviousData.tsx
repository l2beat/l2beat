import { createContext, useContext, useEffect, useRef } from 'react'
import { cn } from '~/utils/cn'

/**
 * Whether the charts below show the previous query's data while the current
 * one loads: TanStack's `isPlaceholderData` under `keepPreviousData`, e.g.
 * after a range switch. Keeping the previous chart on screen, dimmed, stops
 * the plot and its time range from flashing a loader exactly when people
 * compare ranges. The component that runs the query provides it.
 */
const ChartPreviousDataContext = createContext(false)

export function ChartShowsPreviousData({
  value,
  children,
}: {
  value: boolean
  children: React.ReactNode
}) {
  return (
    <ChartPreviousDataContext.Provider value={value}>
      {children}
    </ChartPreviousDataContext.Provider>
  )
}

export function useChartShowsPreviousData() {
  return useContext(ChartPreviousDataContext)
}

/**
 * Dims what shows the previous data and lets it breathe while the new data
 * loads (`--animate-previous-chart-data`). There is no transition back, so
 * the new data appears at full strength at once. With reduced motion it only
 * dims.
 */
export const previousChartDataClassName =
  'animate-previous-chart-data motion-reduce:animate-none motion-reduce:opacity-40'

/**
 * The value the shown data was fetched with. While a chart shows the previous
 * query's data, the current value already belongs to the query still loading,
 * so a resolution derived from it would not match the buckets on screen.
 * A value is kept only once its own query brought data: TanStack keeps the
 * last data it had, so a request that failed must not claim it. It is kept
 * after commit, so a render React throws away cannot leave one either.
 */
export function useValueOfShownData<T>(
  value: T,
  query: { data: unknown; isPlaceholderData: boolean },
) {
  const shown = useRef(value)
  const hasOwnData = !query.isPlaceholderData && query.data !== undefined
  useEffect(() => {
    if (hasOwnData) shown.current = value
  })
  return query.isPlaceholderData ? shown.current : value
}

/** Dims stats derived from the shown data along with the plot. */
export function ChartPreviousDataDim({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const showsPreviousData = useChartShowsPreviousData()
  return (
    <div
      className={cn(showsPreviousData && previousChartDataClassName, className)}
    >
      {children}
    </div>
  )
}
