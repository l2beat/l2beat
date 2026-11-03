import type { ReactNode } from 'react'
import { Logo } from '~/components/Logo'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import { NEW_NAME, type Note } from './newNameText'

/**
 * The rename, told the way the mandate is set: the name on the page's own
 * ground beside the heart, the shift in focus drawn as two maps, the story on
 * white sheets, and the mandate in ink. The practical notes close the page.
 */
export function NewNamePage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      {/* Home's colours: ink text, white sheets and pink links. */}
      <div className="home-theme contents">
        <SideNavLayout childrenWrapperClassName="max-md:bg-surface-primary">
          <main className="flex flex-col gap-4 max-md:gap-0">
            <Hero />
            <PrimaryCard className={SHEET}>
              <FocusShift />
            </PrimaryCard>
            <PrimaryCard className={SHEET}>
              <History />
            </PrimaryCard>
            <PrimaryCard className={SHEET}>
              <Change />
            </PrimaryCard>
            <MandateLink />
            <PrimaryCard className={cn(SHEET, 'md:mb-4')}>
              <Practical />
            </PrimaryCard>
          </main>
        </SideNavLayout>
      </div>
    </AppLayout>
  )
}

// The mandate page's measures, so the two read as one set.
const INSET = 'px-5 md:px-12 lg:px-16'
const SHEET = cn(INSET, 'py-12 md:py-16')
const DISPLAY = 'font-inter font-bold tracking-[-0.03em]'
const BODY =
  'max-w-[36rem] text-pretty text-[18px] leading-[1.65] md:text-[20px] md:leading-[1.6]'
const STATEMENT = cn(
  DISPLAY,
  'text-[28px] leading-[1.1] md:text-[36px] lg:text-[40px]',
)
const HEADING = cn(DISPLAY, 'text-[24px] leading-[1.15] md:text-[28px]')

function Hero() {
  return (
    <header
      className={cn(
        INSET,
        'flex items-center gap-6 pt-8 pb-6 max-sm:flex-col-reverse max-sm:items-start sm:justify-between sm:gap-10 md:pt-12 md:pb-12 lg:pt-14',
      )}
    >
      <div className="flex-1">
        <h1
          className={cn(
            DISPLAY,
            'text-balance text-[40px] leading-[1.02] md:text-[56px] lg:text-[64px] xl:text-[72px]',
          )}
        >
          L2BEAT is now
          <br />
          ETHBEAT
        </h1>
        <p className={cn(BODY, 'mt-5 md:mt-6')}>{NEW_NAME.lede}</p>
      </div>
      <Logo
        small
        animated={false}
        className="mt-0 h-14 w-auto shrink-0 sm:h-32 lg:h-44 xl:h-48"
      />
    </header>
  )
}

/**
 * A new centre: L2BEAT had layer 2s in the middle, with what they rely on
 * around them; ETHBEAT has Ethereum (the heart) in the middle, with layer 2s
 * as one of many equal discs around it. No disc is bigger than another.
 */
function FocusShift() {
  return (
    <section aria-labelledby="focus-heading">
      <h2 id="focus-heading" className={STATEMENT}>
        A new centre
      </h2>
      <div className="mt-10 grid gap-12 md:mt-12 md:grid-cols-2 md:gap-6 lg:gap-10">
        <Orbit
          name="L2BEAT"
          caption="Layer 2s at the centre"
          centre={
            <div className="flex size-[30%] items-center justify-center rounded-full bg-[#e6e3dd] font-inter font-semibold text-[clamp(16px,4.4cqw,22px)] text-brand-ink tracking-[-0.02em] dark:bg-[#3d4358] dark:text-pure-white">
              Layer 2s
            </div>
          }
          radius={28}
          size={20.8}
          satellites={L2BEAT_AROUND}
        />
        <Orbit
          name="ETHBEAT"
          caption="Ethereum at the centre"
          centre={
            <Logo small animated={false} className="mt-0 h-auto w-[30%]" />
          }
          radius={33}
          size={18.4}
          satellites={ETHBEAT_AROUND}
        />
      </div>
      <p className="mt-6 max-w-[36rem] text-[14px] text-secondary leading-5">
        L2BEAT looked at layer 2s and what they rely on. ETHBEAT looks at
        everything built on Ethereum.
      </p>
    </section>
  )
}

interface Satellite {
  label: string
  /** Ground and text together, so every disc keeps 4.5:1. */
  colors: string
}

const LAYER_2S_COLORS =
  'bg-[#e6e3dd] text-brand-ink dark:bg-[#3d4358] dark:text-pure-white'
const AREA_COLORS = 'bg-brand-pink text-brand-ink'
const SOFT_COLORS = 'bg-[#ffd9e4] text-brand-ink'

const L2BEAT_AROUND: Satellite[] = [
  { label: 'Bridges', colors: SOFT_COLORS },
  { label: 'Data availability', colors: SOFT_COLORS },
  { label: 'ZK proofs', colors: SOFT_COLORS },
]
const ETHBEAT_AROUND: Satellite[] = [
  { label: 'Layer 2s', colors: LAYER_2S_COLORS },
  ...[
    'Ethereum L1',
    'Privacy',
    'ZK proving',
    'Interop',
    'Liquid staking',
    'DeFi',
    'Tokens',
  ].map((label) => ({ label, colors: AREA_COLORS })),
  { label: 'And more', colors: SOFT_COLORS },
]

/**
 * One system: a centre, a ring and equal discs spaced evenly on it, the first
 * at the top. Positions and sizes are percentages of the square, and type
 * follows its width (cqw), so the drawing scales from a phone to a desktop.
 */
function Orbit({
  name,
  caption,
  centre,
  radius,
  size,
  satellites,
}: {
  name: string
  caption: string
  centre: ReactNode
  /** Ring radius, as a percentage of the square's width. */
  radius: number
  /** Disc diameter, as a percentage of the square's width. */
  size: number
  satellites: Satellite[]
}) {
  return (
    <figure>
      <figcaption className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <span className={HEADING}>{name}</span>
        <span className="font-medium text-[15px] text-secondary">
          {caption}
        </span>
      </figcaption>
      <div className="relative aspect-square [container-type:inline-size]">
        <div
          aria-hidden
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 rounded-full border-2 border-divider"
          style={{ width: `${2 * radius}%`, height: `${2 * radius}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {centre}
        </div>
        <ul aria-label={`${name}: ${caption}`}>
          {satellites.map((satellite, i) => {
            const angle = (2 * Math.PI * i) / satellites.length - Math.PI / 2
            return (
              <li
                key={satellite.label}
                className={cn(
                  '-translate-x-1/2 -translate-y-1/2 absolute flex aspect-square items-center justify-center rounded-full p-[1.2cqw] text-center font-inter font-semibold text-[clamp(11px,2.9cqw,15px)] leading-[1.15]',
                  satellite.colors,
                )}
                style={{
                  width: `${size}%`,
                  left: `${50 + radius * Math.cos(angle)}%`,
                  top: `${50 + radius * Math.sin(angle)}%`,
                }}
              >
                {satellite.label}
              </li>
            )
          })}
        </ul>
      </div>
    </figure>
  )
}

/** The question L2BEAT was built to answer, and the seven ways it did. */
function History() {
  const { history } = NEW_NAME
  return (
    <section aria-labelledby="history-heading">
      <h2 id="history-heading" className={STATEMENT}>
        {history.heading}
      </h2>
      <div className={cn(BODY, 'mt-8 space-y-6 md:mt-10')}>
        {history.opening.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p
        className={cn(
          DISPLAY,
          'mt-10 max-w-[30ch] text-balance text-[24px] leading-[1.2] md:mt-12 md:text-[30px]',
        )}
      >
        {history.question}
      </p>
      <p className={cn(BODY, 'mt-10 md:mt-12')}>{history.practicesIntro}</p>
      <ol className="mt-6 border-divider border-t">
        {history.practices.map((practice, i) => (
          <li
            key={practice.name}
            className="grid gap-x-16 gap-y-2 border-divider border-b py-6 md:py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <h3 className="flex gap-4 font-bold font-inter text-[20px] leading-tight tracking-[-0.02em] md:text-[24px]">
              <span className="w-7 shrink-0 text-brand-deep tabular-nums dark:text-brand-pink">
                {i + 1}
              </span>
              {practice.name}
            </h3>
            <p className="max-w-[36rem] text-pretty text-[17px] leading-[1.6] max-lg:pl-11 md:text-[18px]">
              {practice.text}
            </p>
          </li>
        ))}
      </ol>
      <p className={cn(BODY, 'mt-10 md:mt-12')}>{history.closing}</p>
    </section>
  )
}

/**
 * How Ethereum changed, and the three questions we now ask of all of it. From
 * lg the areas we cover sit beside the argument, as the mandate's sources do.
 */
function Change() {
  const { change } = NEW_NAME
  return (
    <section
      aria-labelledby="change-heading"
      className="lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-x-16"
    >
      <h2 id="change-heading" className={cn(STATEMENT, 'lg:col-span-2')}>
        {change.heading}
      </h2>
      <div className={cn(BODY, 'mt-8 space-y-6 md:mt-10')}>
        {change.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-10 flex flex-col gap-6 border-brand-pink border-l-[3px] pl-5 md:mt-12 md:gap-8 md:pl-8 lg:col-span-2">
        {change.questions.map((question) => (
          <li
            key={question}
            className={cn(
              DISPLAY,
              'max-w-[32ch] text-balance text-[24px] leading-[1.15] md:text-[36px] lg:text-[40px]',
            )}
          >
            {question}
          </li>
        ))}
      </ul>
      <div className={cn(BODY, 'mt-10 space-y-6 md:mt-12')}>
        {change.after.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <Coverage className="max-lg:mt-12 lg:col-start-2 lg:row-start-4 lg:mt-12" />
    </section>
  )
}

/** A link to each area we cover today. */
function Coverage({ className }: { className?: string }) {
  const { coverage } = NEW_NAME
  return (
    <aside aria-labelledby="coverage-heading" className={className}>
      <h3 id="coverage-heading" className="font-bold text-heading-18">
        {coverage.heading}
      </h3>
      <ul className="mt-4 flex flex-col border-divider border-t">
        {coverage.areas.map((area) => (
          <li key={area.href}>
            <a
              href={area.href}
              className="group flex items-center justify-between border-divider border-b py-3 font-inter font-semibold text-[18px] tracking-[-0.01em] transition-colors hover:text-link"
            >
              {area.label}
              <span
                aria-hidden
                className="text-secondary transition-transform group-hover:translate-x-1 group-hover:text-link"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function MandateLink() {
  return (
    // .home-inverted: ink in light mode, a step up from the sheet in dark,
    // as the mandate's pledge.
    <section
      className={cn(
        INSET,
        'home-inverted bg-surface-primary py-12 text-primary md:rounded-xl md:py-16',
      )}
    >
      <div className="flex items-start justify-between gap-10">
        <p className={cn(STATEMENT, 'max-w-[26ch] text-balance')}>
          {NEW_NAME.mandate.text}
        </p>
        <Logo
          small
          animated={false}
          className="mt-0 h-28 w-auto shrink-0 max-md:hidden lg:h-36"
        />
      </div>
      <a
        href="/mandate"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-bold font-inter text-[18px] text-brand-ink transition-opacity hover:opacity-90 md:mt-10"
      >
        {NEW_NAME.mandate.link}
        <span aria-hidden>→</span>
      </a>
    </section>
  )
}

/** What changed, what did not, and why old links keep working. */
function Practical() {
  const { practical } = NEW_NAME
  return (
    <section aria-labelledby="practical-heading">
      <h2 id="practical-heading" className={STATEMENT}>
        {practical.heading}
      </h2>
      <div className="mt-10 grid gap-10 md:mt-12 lg:grid-cols-2 lg:gap-x-16">
        <NoteList heading="What changed" notes={practical.changed} />
        <NoteList heading="What stays the same" notes={practical.unchanged} />
      </div>
      <div className="mt-12 border-divider border-t pt-10 md:mt-16 md:pt-12">
        <h3 className={HEADING}>{practical.links.heading}</h3>
        <p className="mt-3 max-w-[36rem] text-pretty text-[17px] leading-[1.6] md:text-[18px]">
          {practical.links.text}
        </p>
        <div className="mt-8">
          <UrlMap paths={practical.links.examples} />
        </div>
        <div className="mt-10">
          <NoteList notes={practical.links.notes} columns />
        </div>
      </div>
      <p className="mt-12 text-[17px] md:text-[18px]">
        {practical.questions.text}{' '}
        <a
          href={practical.questions.link.href}
          className="font-semibold text-link underline decoration-link-stroke underline-offset-[0.2em] hover:decoration-current"
        >
          {practical.questions.link.label}
        </a>
        .
      </p>
    </section>
  )
}

function NoteList({
  heading,
  notes,
  columns,
}: {
  heading?: string
  notes: readonly Note[]
  /** Two columns from lg, for a list that spans the sheet. */
  columns?: boolean
}) {
  return (
    <div>
      {heading && (
        <h3 className="mb-5 font-bold font-inter text-[20px] tracking-[-0.02em]">
          {heading}
        </h3>
      )}
      <ul
        className={cn(
          'flex flex-col gap-4',
          columns && 'lg:grid lg:grid-cols-2 lg:gap-x-16',
        )}
      >
        {notes.map((note) => (
          <li
            key={note.lead}
            className="max-w-[36rem] text-pretty text-[16px] leading-[1.6] md:text-[17px]"
          >
            <strong className="font-semibold">{note.lead}</strong>{' '}
            <NoteText note={note} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The note's text, with its link label (if the text names it) as the link. */
function NoteText({ note }: { note: Note }) {
  const link = note.link
  if (!link) return note.text
  const anchor = (
    <a
      href={link.href}
      className="text-link underline decoration-link-stroke underline-offset-[0.2em] hover:decoration-current"
    >
      {link.label}
    </a>
  )
  const at = note.text.indexOf(link.label)
  if (at === -1) {
    return (
      <>
        {note.text} {anchor}
      </>
    )
  }
  return (
    <>
      {note.text.slice(0, at)}
      {anchor}
      {note.text.slice(at + link.label.length)}
    </>
  )
}

/** Old and new addresses side by side: only the domain changes. */
function UrlMap({ paths }: { paths: readonly string[] }) {
  return (
    <dl className="grid w-fit max-w-full grid-cols-1 gap-y-1 overflow-x-auto rounded-lg bg-surface-secondary p-5 font-mono text-[13px] sm:grid-cols-[max-content_max-content] sm:gap-x-5 sm:gap-y-3 md:p-6 md:text-[14px]">
      {['', ...paths].map((path, i) => (
        <div key={path} className="contents">
          <dt
            className={cn(
              'whitespace-nowrap text-secondary',
              i > 0 && 'max-sm:mt-3',
            )}
          >
            l2beat.com{path}
          </dt>
          <dd className="whitespace-nowrap">
            <span aria-hidden className="mr-2 font-sans text-secondary">
              →
            </span>
            <span className="font-semibold">ethbeat.org</span>
            {path}
          </dd>
        </div>
      ))}
    </dl>
  )
}
