import { type KeyboardEvent, type ReactNode, useRef } from 'react'
import { cn } from '~/utils/cn'

/**
 * One instrument: panels share hairlines like a trading screen's, instead of
 * floating as separate cards. The frame's background shows through the 1px
 * gaps, so every rule lines up with its neighbours
 */
export function Instrument({
  children,
  className,
  id,
  as: Component = 'div',
}: {
  children: ReactNode
  className?: string
  id?: string
  as?: 'div' | 'section'
}) {
  return (
    <Component
      id={id}
      className={cn(
        'grid scroll-mt-20 gap-px overflow-hidden border-divider bg-divider md:rounded-lg md:border',
        className,
      )}
    >
      {children}
    </Component>
  )
}

export function Panel({
  title,
  cadence,
  accessory,
  children,
  className,
  bodyClassName,
  id,
}: {
  title?: ReactNode
  cadence?: Cadence
  accessory?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  id?: string
}) {
  return (
    <div
      id={id}
      className={cn(
        'flex min-w-0 scroll-mt-20 flex-col bg-surface-primary',
        className,
      )}
    >
      {(title || accessory) && (
        <div className="flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1.5 border-divider/60 border-b px-3 py-1.5">
          {title && (
            <h3 className="truncate font-semibold text-[12px] text-primary">
              {title}
            </h3>
          )}
          {cadence && <CadenceBadge cadence={cadence} />}
          {accessory && (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {accessory}
            </div>
          )}
        </div>
      )}
      <div className={cn('min-h-0 flex-1', bodyClassName)}>{children}</div>
    </div>
  )
}

export type Cadence = 'blk' | 'epoch' | '1m' | 'day' | 'static'

const CADENCE_TITLES: Record<Cadence, string> = {
  blk: 'Updates every block (12 s)',
  epoch: 'Updates every epoch (6.4 min)',
  '1m': 'Updates every minute',
  day: 'Daily history; today so far updates every block',
  static: 'Updates when we update the assessment',
}

/** How often a value can change, so a still number is not mistaken for a stuck one */
export function CadenceBadge({
  cadence,
  className,
}: {
  cadence: Cadence
  className?: string
}) {
  return (
    <span
      title={CADENCE_TITLES[cadence]}
      className={cn(
        'inline-flex h-4 shrink-0 items-center rounded-[3px] border border-divider px-1 font-mono text-[9.5px] text-secondary leading-none',
        className,
      )}
    >
      {cadence}
    </span>
  )
}

/** A radio group drawn as a terminal toggle; arrow keys move along it */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  function onKeyDown(event: KeyboardEvent) {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (step === 0) return
    event.preventDefault()
    const index = options.findIndex((o) => o.value === value)
    const next = options[(index + step + options.length) % options.length]
    if (!next) return
    onChange(next.value)
    ref.current
      ?.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)
      ?.focus()
  }
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex h-6 items-center rounded-[5px] border border-divider p-px font-mono text-[11px]',
        className,
      )}
    >
      {options.map((option) => {
        const checked = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-value={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-full rounded-[3px] px-1.5 text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-brand',
              checked && 'bg-surface-secondary text-primary',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** A deeper section's title bar: what it answers in a line, then its panels */
export function SectionHead({
  title,
  lede,
  accessory,
}: {
  title: string
  lede: string
  accessory?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-2 px-4 pt-10 pb-3 md:px-0 md:pt-12">
      <div className="min-w-0 max-w-[68ch]">
        <h2 className="font-bold text-[22px] text-primary leading-tight md:text-heading-24">
          {title}
        </h2>
        <p className="mt-1 text-paragraph-14 text-secondary md:text-paragraph-15">
          {lede}
        </p>
      </div>
      {accessory && <div className="ml-auto">{accessory}</div>}
    </div>
  )
}

/** A label over a value, the cell every grid on the console is built from */
export function Readout({
  label,
  cadence,
  children,
  footer,
  className,
}: {
  label: ReactNode
  cadence?: Cadence
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1.5 bg-surface-primary px-3 py-2.5',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[11.5px] text-secondary leading-none">
        <span className="truncate">{label}</span>
        {cadence && <CadenceBadge cadence={cadence} />}
      </div>
      <div className="min-w-0">{children}</div>
      {footer && (
        <div className="truncate font-mono text-[10.5px] text-secondary leading-none">
          {footer}
        </div>
      )}
    </div>
  )
}

export function Unit({ children }: { children: ReactNode }) {
  return (
    <span className="ml-1 font-normal font-sans text-[0.62em] text-secondary">
      {children}
    </span>
  )
}

export function Dash() {
  return <span className="text-secondary/60">—</span>
}
