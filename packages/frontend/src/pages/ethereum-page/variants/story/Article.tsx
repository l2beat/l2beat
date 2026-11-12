import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { type SourceId, sourceNumber } from './footnotes'

/**
 * The story's type scale, all Inter: the variable font switches to its
 * display cut from 32px, so the lede and the claims get tighter, sharper
 * letterforms than the text without a second family. Steps follow a fourth
 * (×1.33): 13, 17/18, 24, 34, 52.
 */
export const TYPE = {
  lede: 'text-[31px] leading-[1.16] tracking-[-0.028em] font-[460] text-pretty md:text-[44px] md:leading-[1.12] xl:text-[52px] xl:leading-[1.1]',
  claim:
    'text-[25px] leading-[1.16] tracking-[-0.021em] font-semibold text-balance md:text-[34px] md:leading-[1.12]',
  standfirst:
    'text-[17px] leading-[1.5] text-secondary text-pretty md:text-[20px] md:leading-[1.45]',
  body: 'text-[17px] leading-[1.65] text-pretty md:text-[18px] md:leading-[1.7]',
  note: 'text-[13px] leading-[1.5] text-secondary text-pretty',
  label: 'text-[13px] leading-[1.35] text-secondary',
  figure:
    'text-[22px] leading-none tracking-[-0.015em] font-semibold md:text-[26px]',
} as const

/** Text column and margin column: notes sit beside the line they explain */
const MEASURE = 'lg:grid-cols-[minmax(0,37rem)_15rem] lg:gap-x-14'

/**
 * One chapter of the story, a card like the assessment sections it sits
 * among. Its heading is a claim with live numbers, and the number box matches
 * the sections' own, so "3" here and "3.1" below read as one sequence.
 */
export function Chapter({
  id,
  order,
  claim,
  standfirst,
  children,
  className,
}: {
  id: string
  order: number
  claim: ReactNode
  standfirst?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-14 border-divider bg-surface-primary px-4 py-10 font-inter max-md:border-b md:mt-4 md:rounded-xl md:px-8 md:py-12 xl:px-12',
        className,
      )}
    >
      <header className="flex items-start gap-4 md:gap-5">
        <a
          href={`#${id}`}
          aria-hidden
          tabIndex={-1}
          className="mt-0.5 hidden size-10 shrink-0 items-center justify-center rounded bg-surface-secondary font-bold text-label-value-24 text-secondary tabular-nums md:flex"
        >
          {order}
        </a>
        <div className="min-w-0 max-w-[46rem]">
          <h2 className={TYPE.claim}>{claim}</h2>
          {standfirst && (
            <p className={cn(TYPE.standfirst, 'mt-3 md:mt-4')}>{standfirst}</p>
          )}
        </div>
      </header>
      <div className="mt-8 md:mt-10 md:pl-[3.75rem]">{children}</div>
    </section>
  )
}

/** A paragraph and, beside it on wide screens or under it on phones, its note */
export function Para({
  children,
  note,
  className,
}: {
  children: ReactNode
  note?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('lg:grid', MEASURE, className)}>
      <p className={cn(TYPE.body, 'max-w-[37rem]')}>{children}</p>
      {note && <Sidenote>{note}</Sidenote>}
    </div>
  )
}

/** Definitions and methodology: a reader who knows can skip it, one who doesn't needn't leave */
export function Sidenote({ children }: { children: ReactNode }) {
  return (
    <aside
      className={cn(
        TYPE.note,
        'mt-3 max-w-[37rem] border-divider border-l-2 pl-3 lg:mt-1.5 lg:border-l lg:pl-4',
      )}
    >
      {children}
    </aside>
  )
}

/** Wide block that spans both columns, for charts */
export function Figure({
  children,
  caption,
  className,
}: {
  children: ReactNode
  caption?: ReactNode
  className?: string
}) {
  return (
    <figure className={cn('my-8 md:my-10', className)}>
      {children}
      {caption && (
        <figcaption className={cn(TYPE.note, 'mt-3 max-w-[46rem]')}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** A footnote mark: the number of its source in the list at the end */
export function Ref({ id }: { id: SourceId }) {
  const n = sourceNumber(id)
  return (
    <sup className="ml-px font-semibold text-[0.62em] text-link leading-none">
      <a
        href={`#source-${id}`}
        aria-label={`Source ${n}`}
        className="px-px hover:underline"
      >
        {n}
      </a>
    </sup>
  )
}

/** Stands where a live number will be, at about its width, so text doesn't jump */
export function ValueSlot({ chars }: { chars: number }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[0.78em] animate-pulse rounded-[3px] bg-surface-secondary align-baseline motion-reduce:animate-none"
      style={{ width: `${chars * 0.6}em` }}
    />
  )
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-primary">{children}</strong>
}
