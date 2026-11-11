import { cn } from '~/utils/cn'

/**
 * Dims what shows the previous query's data while the current one loads
 * (TanStack's `isPlaceholderData` under `keepPreviousData`, e.g. after a
 * range switch). Keeping the previous chart on screen, dimmed, stops the
 * plot and its time range from flashing a loader exactly when people compare
 * ranges. The delay keeps a fetch that answers fast from blinking; there is
 * no transition back, so the new data appears at full strength at once.
 */
export const previousChartDataClassName =
  'opacity-40 transition-opacity delay-150 duration-200'

/** Dims stats derived from the shown data along with the plot. */
export function ChartPreviousDataDim({
  isPlaceholderData,
  className,
  children,
}: {
  isPlaceholderData: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(isPlaceholderData && previousChartDataClassName, className)}
    >
      {children}
    </div>
  )
}
