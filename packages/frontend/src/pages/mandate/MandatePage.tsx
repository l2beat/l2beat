import { useEffect, useRef, useState } from 'react'
import {
  DECLARATION_BODY as BODY,
  DeclarationHero,
  DeclarationLayout,
  DECLARATION_DISPLAY as DISPLAY,
  DECLARATION_INSET as INSET,
  DECLARATION_SHEET as SHEET,
  DECLARATION_STATEMENT as STATEMENT,
} from '~/components/declaration/Declaration'
import { Logo } from '~/components/Logo'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { cn } from '~/utils/cn'
import { MANDATE, type MandateSource } from './mandateText'

/**
 * The mandate as a declaration: the belief opens it beside the heart, the
 * argument and the four things we do follow on a white sheet, and the pledge
 * closes it in ink, signed with the heartbeat and sealed with the heart, like
 * the charter on the home page's mandate card. No page header or search bar:
 * the belief is the page's title.
 */
export function MandatePage(props: AppLayoutProps) {
  return (
    <DeclarationLayout {...props}>
      <Belief />
      {/* From lg the sources sit beside the argument, in the room its
          measure leaves; below it they close the sheet, so the verbs
          follow the argument directly. */}
      <PrimaryCard
        className={cn(
          SHEET,
          'flex flex-col lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-x-16',
        )}
      >
        <Argument />
        <Sources className="max-lg:order-last max-lg:mt-16 md:max-lg:mt-24 lg:col-start-2 lg:row-start-1 lg:pt-1.5" />
        <Verbs className="lg:col-span-2" />
      </PrimaryCard>
      <Pledge />
    </DeclarationLayout>
  )
}

function Belief() {
  return (
    <DeclarationHero>
      <h1
        className={cn(
          DISPLAY,
          'max-w-[20ch] flex-1 text-balance text-[36px] leading-[1.04] md:text-[48px] lg:text-[52px] xl:text-[60px]',
        )}
      >
        {MANDATE.belief}
      </h1>
    </DeclarationHero>
  )
}

const HARMS = MANDATE.problem.harms.map((harm, i, harms) => ({
  ...harm,
  first: harms.slice(0, i).reduce((n, h) => n + h.sources.length, 0) + 1,
}))

function Argument() {
  const { opening, closing } = MANDATE.problem
  return (
    <div className={cn(BODY, 'space-y-6')}>
      <p>
        {opening}{' '}
        {HARMS.map((harm) => (
          <span key={harm.claim}>
            {harm.claim}
            <Citation
              from={harm.first}
              to={harm.first + harm.sources.length - 1}
            />
            .{' '}
          </span>
        ))}
        {closing}
      </p>
      <p>{MANDATE.ethereum}</p>
      <p>{MANDATE.mission}</p>
    </div>
  )
}

/** One list per harm, so each citation's range is one group. */
function Sources({ className }: { className?: string }) {
  return (
    <aside aria-labelledby="mandate-sources" className={className}>
      <h2 id="mandate-sources" className="font-bold text-heading-18">
        Sources
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {HARMS.map((harm) => (
          <SourceList
            key={harm.claim}
            sources={harm.sources}
            first={harm.first}
          />
        ))}
      </div>
    </aside>
  )
}

function Citation({ from, to }: { from: number; to: number }) {
  return (
    <sup className="ml-0.5">
      <a
        href={`#source-${from}`}
        aria-label={`Sources ${from} to ${to}`}
        className="font-medium text-link hover:underline"
      >
        {from}–{to}
      </a>
    </sup>
  )
}

function SourceList({
  sources,
  first,
}: {
  sources: MandateSource[]
  first: number
}) {
  return (
    <ol
      start={first}
      className="list-decimal space-y-1.5 pl-6 text-[14px] text-secondary leading-5 marker:tabular-nums"
    >
      {sources.map((source, i) => (
        <li
          key={source.href}
          id={`source-${first + i}`}
          className="scroll-mt-6 text-pretty pl-1"
        >
          <a
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-[0.25em] transition-colors hover:decoration-current"
          >
            {source.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

/** Each verb set large beside the sentence it begins, which keeps its bold. */
function Verbs({ className }: { className?: string }) {
  return (
    <div
      className={cn('mt-16 flex flex-col gap-10 md:mt-24 md:gap-14', className)}
    >
      {MANDATE.verbs.map((verb) => (
        <section
          key={verb.name}
          className="grid gap-x-16 gap-y-3 lg:not-last:min-h-36 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-baseline"
        >
          <h2 className={STATEMENT}>{verb.name}</h2>
          <p className={BODY}>
            {verb.before}
            <strong className="font-semibold">{verb.verb}</strong>
            {verb.after}
          </p>
        </section>
      ))}
    </div>
  )
}

function Pledge() {
  return (
    // .home-inverted: ink in light mode, a step up from the sheet in dark.
    <section
      className={cn(
        INSET,
        'home-inverted bg-surface-primary pt-12 pb-10 text-primary md:mb-4 md:rounded-xl md:pt-16 md:pb-16',
      )}
    >
      <p className="max-w-[44rem]">
        <span className={cn(STATEMENT, 'block text-balance')}>
          {MANDATE.promise.pledge}
        </span>{' '}
        <span className={cn(BODY, 'mt-6 block text-primary/80 md:mt-8')}>
          {MANDATE.promise.terms}
        </span>
      </p>
      {/* From the block's left edge to the heart, inset like the text. */}
      <Signature className="-ml-5 md:-ml-12 lg:-ml-16 mt-12 md:mt-16" />
    </section>
  )
}

/**
 * The heartbeat signing the pledge: a line runs in from the edge, beats once
 * and ends in the heart, which beats in answer. It plays once, when the whole
 * signature is in view. The server renders it whole, so it shows without
 * script, and reduced motion keeps it that way.
 */
function Signature({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'whole' | 'waiting' | 'signing'>('whole')
  useEffect(() => {
    const element = ref.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    setState('waiting')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setState('signing')
        observer.disconnect()
      },
      { threshold: 1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      data-state={state}
      className={cn('group/sign flex items-center', className)}
    >
      <span className="h-[3px] min-w-0 flex-1 origin-left bg-brand group-data-[state=waiting]/sign:scale-x-0 group-data-[state=signing]/sign:[animation:mandate-rule_0.7s_cubic-bezier(0.23,1,0.32,1)_both]" />
      {/* The beat from the home page's charter, 3px like the line. */}
      <svg viewBox="0 -34 47 68" className="-mx-px h-16 w-11 shrink-0">
        <path
          d="M0 0h8l6-12 9 26 8-34 6 20h10"
          pathLength={1}
          fill="none"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-brand [stroke-dasharray:1] group-data-[state=signing]/sign:[animation:mandate-sign_0.45s_ease-out_0.6s_both] group-data-[state=waiting]/sign:[stroke-dashoffset:1]"
        />
      </svg>
      <Logo
        small
        animated={false}
        className="-ml-1 mt-0 h-14 w-auto shrink-0 group-data-[state=signing]/sign:[animation:mandate-heart_0.6s_ease-out_1s_both]"
      />
    </div>
  )
}
