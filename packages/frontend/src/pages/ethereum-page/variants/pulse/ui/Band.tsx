import type { ReactNode } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

/**
 * One chapter of the page: a title, the sentence that answers it, then
 * the one chart that shows it. Researcher detail waits in `deeper`, so the
 * band reads in seconds and the detail costs a tap, not a scroll.
 */
export function Band({
  id,
  title,
  lead,
  children,
  deeper,
  deeperLabel,
  className,
}: {
  id: string
  title: string
  lead: ReactNode
  children: ReactNode
  deeper?: ReactNode
  /** What the expander holds, so it is opened on purpose */
  deeperLabel?: string
  className?: string
}) {
  return (
    <section
      id={id}
      data-role="nav-section"
      className={cn(
        'mt-3 scroll-mt-20 bg-surface-primary px-4 pt-10 md:mt-4 md:rounded-2xl md:px-10 md:pt-12',
        deeper ? 'pb-2 md:pb-3' : 'pb-10 md:pb-12',
        className,
      )}
    >
      <header className="max-w-[46rem]">
        <h2 className="text-heading-28 md:text-heading-36">{title}</h2>
        <p className="mt-3 font-light text-paragraph-18 text-secondary md:text-[22px] md:leading-[1.45]">
          {lead}
        </p>
      </header>
      <div className="mt-8 md:mt-10">{children}</div>
      {deeper && <GoDeeper label={deeperLabel}>{deeper}</GoDeeper>}
    </section>
  )
}

function GoDeeper({
  label,
  children,
}: {
  label: string | undefined
  children: ReactNode
}) {
  return (
    <Collapsible className="mt-8 border-divider border-t md:mt-10">
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 py-4 text-left md:py-5">
        <span>
          <span className="font-bold text-label-value-16 text-primary">
            Go deeper
          </span>
          {label && (
            <span className="ml-2 text-paragraph-14 text-secondary max-sm:mt-1 max-sm:ml-0 max-sm:block">
              {label}
            </span>
          )}
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-secondary transition-transform duration-300 group-data-[state=open]:rotate-180">
          <ChevronIcon className="size-3 fill-primary" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-8 md:pb-10">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/** A number big enough to read across the room, its unit quieter beside it */
export function BigNumber({
  value,
  unit,
  className,
}: {
  value: ReactNode
  unit?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex items-baseline gap-1.5 font-light text-[40px] text-primary tabular-nums leading-none tracking-[-0.03em] md:text-[52px]',
        className,
      )}
    >
      {value}
      {unit && (
        <span className="font-normal text-[0.42em] text-secondary tracking-normal">
          {unit}
        </span>
      )}
    </span>
  )
}

/** A segmented switch for the band's chart: few options, all visible */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-full bg-surface-secondary p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className="rounded-full px-3 py-1.5 font-medium text-label-value-14 text-secondary transition-colors focus-visible:outline-2 focus-visible:outline-brand aria-checked:bg-surface-primary aria-checked:text-primary aria-checked:shadow-sm"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function Stat({
  label,
  children,
  sub,
  cadence,
  className,
}: {
  label: ReactNode
  children: ReactNode
  sub?: ReactNode
  cadence?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label-value-14 text-secondary">
        {label}
        {cadence}
      </div>
      <div className="mt-3">{children}</div>
      {sub && (
        <div className="mt-2 text-paragraph-14 text-secondary tabular-nums">
          {sub}
        </div>
      )}
    </div>
  )
}
