import type React from 'react'
import type { ReactNode } from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HorizontalSeparator } from '../HorizontalSeparator'

/**
 * What a tooltip sums up and its total, over a divider: the lead of every
 * breakdown, in charts and table cells alike. The content below sets the
 * gap after the divider.
 */
export function TooltipHeader({
  label,
  value,
  className,
}: {
  label: ReactNode
  value?: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-x-4 text-heading-16">
        <span>{label}</span>
        {value !== undefined && (
          <span className="whitespace-nowrap tabular-nums">{value}</span>
        )}
      </div>
      <HorizontalSeparator className="mt-2" />
    </div>
  )
}

/**
 * A key, with an optional swatch, and its value on the key's baseline. The
 * swatch sits by the key's first line, so a key that wraps keeps it there.
 */
export function TooltipRow({
  indicator,
  label,
  labelClassName,
  children,
  gap = 'gap-x-3',
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  indicator?: ReactNode
  label: ReactNode
  labelClassName?: string
  children: ReactNode
  /** The least space between the key and the value. */
  gap?: `gap-${string}`
}) {
  return (
    <div
      className={cn(
        'flex w-full items-baseline justify-between',
        gap,
        className,
      )}
      {...props}
    >
      <span className="flex items-baseline gap-1.5">
        {/* As tall as the key's first line, so the swatch centres on it. */}
        {indicator && (
          <span className="flex h-4 shrink-0 items-center self-start">
            {indicator}
          </span>
        )}
        <span
          className={cn(
            'font-medium text-label-value-14 leading-[1.15]',
            labelClassName,
          )}
        >
          {label}
        </span>
      </span>
      <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
        {children}
      </span>
    </div>
  )
}

/** A part's share of the total, after its value: meta, so secondary. */
export function TooltipShare({ value }: { value: number }) {
  return <span className="text-secondary">({formatPercent(value)})</span>
}

/** Meta under a tooltip's content: what a figure compares to, a click hint. */
export function TooltipFootnote({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-paragraph-12 text-secondary', className)}>
      {children}
    </p>
  )
}
