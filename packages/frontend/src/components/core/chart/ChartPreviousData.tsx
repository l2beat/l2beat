import { createContext, useContext } from 'react'
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
 * Dims what shows the previous data. The delay keeps a fetch that answers
 * fast from blinking; there is no transition back, so the new data appears
 * at full strength at once.
 */
export const previousChartDataClassName =
  'opacity-40 transition-opacity delay-150 duration-200'

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
