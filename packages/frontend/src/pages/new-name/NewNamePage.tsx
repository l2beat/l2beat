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
import { CentreDrawing } from './centreDrawing'
import { NEW_NAME, type Note } from './newNameText'

/**
 * The rename, told the way the mandate is set: the name on the page's own
 * ground beside the heart, the shift in focus drawn as two rings, the story on
 * white sheets, and the mandate in ink. The practical notes close the page.
 */
export function NewNamePage(props: AppLayoutProps) {
  return (
    <DeclarationLayout {...props}>
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
    </DeclarationLayout>
  )
}

const HEADING = cn(DISPLAY, 'text-[24px] leading-[1.15] md:text-[28px]')

function Hero() {
  return (
    <DeclarationHero>
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
    </DeclarationHero>
  )
}

/**
 * A new centre: L2BEAT had layer 2s in the middle, ringed by what they rely
 * on; ETHBEAT has Ethereum in the middle, and layer 2s are one of its equal
 * sectors (the pink one). No sector is bigger than another.
 */
function FocusShift() {
  return (
    <section
      aria-labelledby="focus-heading"
      className="grid gap-y-8 md:grid-cols-[0.72fr_1fr] md:grid-rows-[auto_1fr] md:gap-x-8 md:gap-y-10 lg:gap-x-12"
    >
      <div className="md:col-start-1 md:row-start-1">
        <h2 id="focus-heading" className={STATEMENT}>
          A new centre
        </h2>
        <p className={cn(BODY, 'mt-5 text-balance md:max-w-none')}>
          L2BEAT was built around layer&nbsp;2s. ETHBEAT is built around
          Ethereum, and layer&nbsp;2s are one of the many things around it.
        </p>
      </div>
      <figure className="md:col-start-1 md:row-start-2 md:self-end">
        <h3 className={STATE_NAME}>L2BEAT</h3>
        <CentreDrawing
          kind="l2beat"
          className="max-w-[86%] md:max-w-none"
          label="L2BEAT: layer 2s at the centre, with bridges, data availability and ZK around them"
        />
      </figure>
      <figure className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-end">
        <h3 className={STATE_NAME}>ETHBEAT</h3>
        <CentreDrawing
          kind="ethbeat"
          label="ETHBEAT: Ethereum at the centre, with layer 2s, privacy, ZK, interop, staking, DeFi, tokens and more around it, all the same size"
        />
      </figure>
    </section>
  )
}

const STATE_NAME = cn(
  DISPLAY,
  'mb-2 text-[24px] leading-none md:mb-3 md:text-[28px] lg:mb-5 lg:text-[32px]',
)

/**
 * The question L2BEAT was built to answer, and the seven ways it did. From lg
 * the question sits beside the opening as a pull quote, so the capped measure
 * does not leave half the sheet empty.
 */
function History() {
  const { history } = NEW_NAME
  return (
    <section aria-labelledby="history-heading">
      <h2 id="history-heading" className={STATEMENT}>
        {history.heading}
      </h2>
      <div className="mt-8 md:mt-10 lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-x-16">
        <div className={cn(BODY, 'space-y-6')}>
          {history.opening.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p
          className={cn(
            DISPLAY,
            'mt-10 max-w-[30ch] text-balance text-[24px] leading-[1.2] md:mt-12 md:text-[30px] lg:mt-0 lg:border-brand lg:border-l-[3px] lg:pl-8',
          )}
        >
          {history.question}
        </p>
      </div>
      <p className={cn(BODY, 'mt-10 md:mt-12')}>{history.practicesIntro}</p>
      <ol className="mt-6 border-divider border-t">
        {history.practices.map((practice, i) => (
          <li
            key={practice.name}
            className="grid gap-x-16 gap-y-2 border-divider border-b py-6 md:py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <h3 className="flex gap-4 font-bold font-inter text-[20px] leading-tight tracking-[-0.02em] md:text-[24px]">
              <span className="w-7 shrink-0 text-brand-deep tabular-nums dark:text-brand">
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
      <ul className="mt-10 flex flex-col gap-6 border-brand border-l-[3px] pl-5 md:mt-12 md:gap-8 md:pl-8 lg:col-span-2">
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
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold font-inter text-[18px] text-brand-ink transition-opacity hover:opacity-90 md:mt-10"
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
