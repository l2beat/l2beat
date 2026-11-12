import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { formatBlockNumber } from '../format'
import { useAnchor } from '../state/anchor'
import { RewindGlyph } from '../timeline/RewindSweep'

/**
 * A chapter of the page, framed like the project sections it sits beside so
 * the reused risk sections read as part of the same sequence. Anchors land
 * below the sticky chain, not under it.
 */
export function Section({
  id,
  order,
  title,
  lede,
  children,
  className,
}: {
  id: string
  order: number
  title: string
  /** One or two sentences: the section's claim, in plain words */
  lede?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-40 bg-surface-primary px-4 py-8 max-md:border-divider max-md:border-b md:scroll-mt-48 md:rounded-xl md:p-6',
        className,
      )}
    >
      <header className="mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <a href={`#${id}`} className="flex items-center gap-4">
            <span className="hidden size-10 items-center justify-center rounded bg-surface-secondary font-bold text-label-value-24 text-secondary tabular-nums md:flex">
              {order}
            </span>
            <h2 className="text-heading-24 md:text-heading-28">{title}</h2>
          </a>
          <AnchorBadge />
        </div>
        {lede && (
          <p className="max-w-[68ch] text-paragraph-15 text-secondary md:text-paragraph-16">
            {lede}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}

/** Says which block a section's numbers are from, and that it's not the head */
export function AnchorBadge({ className }: { className?: string }) {
  const { block, isLive, orphaned } = useAnchor()
  if (!block || isLive) return null
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full bg-chart-ethereum/12 px-2.5 py-1 font-medium text-label-value-12 text-primary tabular-nums',
        className,
      )}
    >
      <RewindGlyph className="size-3 text-chart-ethereum" />
      {orphaned ? 'At orphaned block' : 'At block'}{' '}
      {formatBlockNumber(block.number ?? 0)}
    </span>
  )
}

/** A sub-part of a section with its own anchor */
export function Part({
  id,
  title,
  children,
  className,
}: {
  id?: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div id={id} className={cn('scroll-mt-40 md:scroll-mt-48', className)}>
      <h3 className="mb-4 font-bold text-heading-18">{title}</h3>
      {children}
    </div>
  )
}

export type Cadence = 'block' | 'epoch' | 'minute' | 'day' | 'static'

const CADENCE_TEXT: Record<Cadence, string> = {
  block: 'per block',
  epoch: 'per epoch',
  minute: 'per minute',
  day: 'daily',
  static: 'on review',
}

/**
 * A number with its label and how often it changes. The cadence is quiet
 * text, so it's there for those who look without competing with the value.
 */
export function Stat({
  label,
  cadence,
  value,
  sub,
  className,
  size = 'md',
}: {
  label: ReactNode
  cadence: Cadence
  value: ReactNode
  sub?: ReactNode
  className?: string
  size?: 'md' | 'lg'
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 font-medium text-label-value-13 text-secondary leading-tight">
          {label}
        </span>
        <CadenceMark cadence={cadence} />
      </div>
      <div
        className={cn(
          'font-bold text-primary tabular-nums',
          size === 'lg'
            ? 'text-heading-24 md:text-heading-32'
            : 'text-heading-20 md:text-heading-24',
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="text-label-value-13 text-secondary leading-snug">
          {sub}
        </div>
      )}
    </div>
  )
}

export function CadenceMark({ cadence }: { cadence: Cadence }) {
  return (
    <span
      className="flex shrink-0 items-center gap-1 text-[11px] text-secondary/80 leading-none"
      title={`Updates ${CADENCE_TEXT[cadence]}`}
    >
      <span
        className={cn(
          'size-1 rounded-full',
          cadence === 'block' && 'bg-brand',
          cadence === 'epoch' && 'bg-chart-ethereum',
          cadence === 'minute' && 'bg-chart-teal',
          (cadence === 'day' || cadence === 'static') && 'bg-secondary',
        )}
      />
      {CADENCE_TEXT[cadence]}
    </span>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex shrink-0 rounded-lg bg-surface-secondary p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          onClick={() => onChange(o.id)}
          className="rounded-md px-2.5 py-1 font-medium text-label-value-13 text-secondary transition-colors hover:text-primary aria-checked:bg-surface-primary aria-checked:text-primary aria-checked:shadow-sm"
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
