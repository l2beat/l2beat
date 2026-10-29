import type { ReactNode } from 'react'
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
