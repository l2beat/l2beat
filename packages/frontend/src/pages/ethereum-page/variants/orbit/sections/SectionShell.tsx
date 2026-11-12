import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'
import { RANGES, type RangeId } from '../model'

/**
 * A chapter of the dependency story. Numbered like the project sections it
 * sits among, so the flows and risk sections nested under it read as 3.1, 5.1
 */
export function SectionShell({
  id,
  order,
  title,
  lede,
  accessory,
  children,
  className,
}: {
  id: string
  order: number
  title: string
  lede: ReactNode
  accessory?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      data-role="nav-section"
      className={cn(
        'scroll-mt-4 bg-surface-primary px-4 py-8 max-md:border-divider max-md:border-b md:mt-4 md:rounded-lg md:p-6',
        className,
      )}
    >
      <header className="flex flex-wrap items-start gap-x-4 gap-y-3">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded bg-surface-secondary font-bold text-label-value-24 text-secondary tabular-nums md:flex">
          {order}
        </div>
        <div className="min-w-0 flex-1 basis-[420px]">
          <h2 className="text-heading-24 md:text-heading-28">{title}</h2>
          <p className="mt-2 max-w-[68ch] text-paragraph-15 text-secondary">
            {lede}
          </p>
        </div>
        {accessory && <div className="shrink-0">{accessory}</div>}
      </header>
      <div className="mt-6 md:mt-7">{children}</div>
    </section>
  )
}

/** One live figure: what it is, its value, how often it changes */
export function LiveStat({
  label,
  value,
  unit,
  detail,
  cadence,
  ready = true,
  className,
}: {
  label: string
  value: ReactNode
  unit?: string
  detail?: ReactNode
  cadence: string
  ready?: boolean
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="text-label-value-13 text-secondary">{label}</div>
      <div className="mt-2 flex items-baseline gap-1 font-bold text-heading-24 tabular-nums">
        {ready ? (
          <>
            {value}
            {unit && (
              <span className="font-medium text-label-value-14 text-secondary">
                {unit}
              </span>
            )}
          </>
        ) : (
          <Skeleton className="h-6 w-24" />
        )}
      </div>
      {detail && (
        <div className="mt-1.5 text-label-value-12 text-secondary leading-snug">
          {ready ? detail : <Skeleton className="h-3 w-28" />}
        </div>
      )}
      <div className="mt-1 text-[11px] text-secondary/70 leading-none">
        {cadence}
      </div>
    </div>
  )
}

export function RangeTabs({
  value,
  onChange,
  label,
}: {
  value: RangeId
  onChange: (range: RangeId) => void
  label: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-lg bg-surface-secondary p-0.5"
    >
      {RANGES.map((range) => (
        <button
          key={range.id}
          type="button"
          role="radio"
          aria-checked={range.id === value}
          onClick={() => onChange(range.id)}
          className={cn(
            'rounded-md px-2.5 py-1 font-medium text-label-value-13 text-secondary transition-colors',
            range.id === value && 'bg-surface-primary text-primary shadow-sm',
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

/** A chart with its own short heading and the figure it summarizes */
export function ChartBlock({
  id,
  title,
  summary,
  children,
  className,
}: {
  id?: string
  title: string
  summary?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div id={id} className={cn('min-w-0 scroll-mt-4', className)}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-bold text-heading-16">{title}</h3>
        {summary && (
          <span className="text-label-value-12 text-secondary">{summary}</span>
        )}
      </div>
      {children}
    </div>
  )
}
