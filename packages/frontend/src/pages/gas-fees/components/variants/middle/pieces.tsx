import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'
import { percent } from '../../parts'

/**
 * Pieces shared by the middle card's variants: a legend of small squares
 * with bold values, a keyed bar, and big numbers
 */

/** The card's title, set as a small tracked label, as the picked top card does */
export function CardLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'font-semibold text-2xs text-secondary uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Colored({
  color,
  children,
}: {
  color: string
  children: React.ReactNode
}) {
  return (
    <span className="tabular-nums" style={{ color }}>
      {children}
    </span>
  )
}

export interface LegendItem {
  key: string
  label: React.ReactNode
  color: string
  value?: React.ReactNode
}

/** Small squares, a quiet name and a bold value, spread across the width */
export function Legend({
  items,
  className,
}: {
  items: LegendItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs',
        className,
      )}
    >
      {items.map((item) => (
        <span key={item.key} className="flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-xs"
            style={{ background: item.color }}
          />
          <span className="whitespace-nowrap text-secondary">{item.label}</span>
          {item.value !== undefined && (
            <b className="whitespace-nowrap tabular-nums">{item.value}</b>
          )}
        </span>
      ))}
    </div>
  )
}

/** A thin whole with its legend under it */
export function KeyedBar({
  parts,
  className,
}: {
  parts: { key: string; label: string; value: number; color: string }[]
  className?: string
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex h-4 gap-[3px]">
        {parts.map((p) => (
          <span
            key={p.key}
            className="min-w-[3px] first:rounded-l-md last:rounded-r-md"
            style={{
              width: `${total > 0 ? (p.value / total) * 100 : 0}%`,
              background: p.color,
            }}
          />
        ))}
      </div>
      <Legend
        items={parts.map((p) => ({
          key: p.key,
          label: p.label,
          color: p.color,
          value: percent(total > 0 ? p.value / total : 0),
        }))}
      />
    </div>
  )
}

/** A big figure with a quiet note beside it */
export function BigNumber({
  value,
  note,
  color,
  size = 'text-3xl',
}: {
  value: React.ReactNode
  note?: React.ReactNode
  color?: string
  size?: string
}) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
      <span
        className={cn(
          'whitespace-nowrap font-bold tabular-nums tracking-tight',
          size,
        )}
        style={{ color }}
      >
        {value}
      </span>
      {note && <span className="text-secondary text-sm">{note}</span>}
    </span>
  )
}

export function StatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  )
}
