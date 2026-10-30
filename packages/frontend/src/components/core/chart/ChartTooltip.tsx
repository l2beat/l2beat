import type { ReactNode, SyntheticEvent } from 'react'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../tooltip/Tooltip'
import { useChart } from './ChartContext'
import { ChartDataIndicator } from './ChartDataIndicator'

export interface TooltipEntry<K extends string = string> {
  name: K
  value: number | null
}

export function ChartTooltipWrapper({ children }: { children: ReactNode }) {
  return <div className={tooltipContentVariants()}>{children}</div>
}

/**
 * One entry per key, in key order. `skipNull` drops keys without a value at
 * the row.
 */
export function getTooltipEntries<K extends string>(
  row: unknown,
  keys: readonly K[],
  options: { skipNull: true },
): { name: K; value: number }[]
export function getTooltipEntries<K extends string>(
  row: unknown,
  keys: readonly K[],
  options?: { skipNull?: boolean },
): TooltipEntry<K>[]
export function getTooltipEntries<K extends string>(
  row: unknown,
  keys: readonly K[],
  { skipNull = false }: { skipNull?: boolean } = {},
): TooltipEntry<K>[] {
  return keys.flatMap((name) => {
    const value = toNumber((row as Record<string, unknown>)[name])
    return skipNull && value === null ? [] : [{ name, value }]
  })
}

/** The sum of the entries with a value, or null when none has one. */
export function sumEntries(entries: readonly TooltipEntry[]): number | null {
  let total: number | null = null
  for (const { value } of entries) {
    if (value !== null) total = (total ?? 0) + value
  }
  return total
}

/**
 * The rows of a tooltip that can grow taller than its chart. A tap leaves a
 * tooltip in place, so on a touch screen they scroll, below a title that
 * stays in view, and are cut to fit the chart (see `useChartTooltip`). A
 * hover tooltip follows the cursor, which never reaches it, so there they
 * show in full.
 */
export function ChartTooltipRows({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const isTouchScreen =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  if (!isTouchScreen) return <div className={className}>{children}</div>
  return (
    <ScrollWithGradient
      data-chart-tooltip-rows
      // Its scrollbar sits in the tooltip's padding, clear of the values.
      className={cn('-mr-3 overscroll-contain pr-3', className)}
      {...keepTouchesInTooltip}
    >
      {children}
    </ScrollWithGradient>
  )
}

/**
 * A series' indicator and label from the chart meta, then its value. On
 * phones the label wraps at 80px unless `wrapLabel` is false. A series
 * missing from the meta has no row.
 */
export function ChartTooltipRow({
  name,
  children,
  gap = 'gap-2',
  wrapLabel = true,
}: {
  name: string
  children: ReactNode
  /** The least space between the label and the value. */
  gap?: `gap-${string}`
  wrapLabel?: boolean
}) {
  const { meta } = useChart()
  const config = meta[name]
  if (!config) return null
  return (
    <div className={cn('flex w-full items-center justify-between', gap)}>
      <span className="flex items-center gap-1">
        <ChartDataIndicator
          backgroundColor={config.color}
          type={config.indicatorType}
        />
        <span
          className={cn(
            'font-medium text-label-value-14',
            wrapLabel && 'w-20 sm:w-fit',
          )}
        >
          {config.label}
        </span>
      </span>
      {children}
    </div>
  )
}

/** A formatted value, or "No data". */
export function ChartTooltipValue({
  value,
  format,
  className,
}: {
  value: number | null
  format: (value: number) => ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'whitespace-nowrap font-medium text-label-value-15',
        className,
      )}
    >
      {value === null ? 'No data' : format(value)}
    </span>
  )
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/** Scrolling the tooltip must not move the chart's hover beneath it. */
const stopPropagation = (e: SyntheticEvent) => e.stopPropagation()
const keepTouchesInTooltip = {
  onClick: stopPropagation,
  onPointerDown: stopPropagation,
  onPointerMove: stopPropagation,
  onTouchStart: stopPropagation,
  onTouchMove: stopPropagation,
  onTouchEnd: stopPropagation,
}
