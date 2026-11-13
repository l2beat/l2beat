import type { PrivacyAdversary, PrivacyAdversaryId } from '@l2beat/config'
import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { type ReactNode, useEffect, useRef } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { PrivacyAdversaryLink } from '~/components/projects/sections/privacy/PrivacyAdviceSteps'
import { WarningBar } from '~/components/WarningBar'
import { ChevronIcon } from '~/icons/Chevron'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { PrivacySentimentDot } from '~/pages/privacy/PrivacySentimentDot'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { cn } from '~/utils/cn'
import { ADVICE_EFFORTS } from '../advicePaths'
import {
  getDefaultFrom,
  MATCH_GROUP_IDS,
  type MatchChoices,
  type MatchGroupId,
  type ProtocolMatch,
  type ProtocolMatches,
} from '../matchProtocols'
import {
  type ChoiceRelaxation,
  getChoiceRelaxations,
  getUncoveredAdversaries,
} from '../relaxChoices'
import { getOutsideNames } from '../setupTools'
import {
  getAllFilteredTitle,
  getMatchCountText,
  getMatchSummary,
  getUncoveredText,
  getWaitText,
  STAY_PRIVATE,
} from '../stayPrivateCopy'
import { SetupDetails } from './SetupDetails'

const GROUP_SENTIMENT = {
  private: 'good',
  atRisk: 'warning',
  exposed: 'bad',
} as const satisfies Record<MatchGroupId, string>

interface Props {
  matches: ProtocolMatches<PrivacyAdviceProtocol>
  choices: MatchChoices
  protocols: PrivacyAdviceProtocol[]
  adversaries: PrivacyAdversary[]
  waitWindowDays: number
  selected: string | undefined
  onSelect: (slug: string | undefined) => void
  onChange: (choices: MatchChoices) => void
}

/**
 * The protocols of the chosen need in three groups, by our ratings against
 * the adversaries the user chose. No rank: a group says what holds, and the
 * rows show the ratings that put a protocol there. A protocol's setup opens
 * under its row, so the user never loses their place in the list.
 *
 * Every way the list can come up short says why and offers the way out: no
 * adversary chosen, no protocol for the need, filters that rule out all, and
 * no protocol private from everyone chosen.
 */
export function ProtocolMatchesCard(props: Props) {
  const { matches, choices } = props
  const grouped = MATCH_GROUP_IDS.flatMap((id) => matches.groups[id])
  const total =
    grouped.length + matches.excluded.length + matches.unchecked.length

  return (
    <PrimaryCard className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          {STAY_PRIVATE.matchesTitle}
        </h2>
        {choices.from.length > 0 && grouped.length > 0 && (
          <>
            {matches.groups.private.length > 0 && (
              <p className="text-paragraph-15">
                {getMatchSummary(
                  matches.groups.private.length,
                  grouped.length,
                  choices.from.length,
                )}
              </p>
            )}
            <Legend />
            <p className="text-paragraph-12 text-secondary">
              {STAY_PRIVATE.matchNote}
            </p>
          </>
        )}
      </header>
      <ResultsBody {...props} grouped={grouped.length} total={total} />
    </PrimaryCard>
  )
}

function ResultsBody({
  grouped,
  total,
  ...props
}: Props & { grouped: number; total: number }) {
  const { matches, choices, adversaries, onChange } = props

  if (total === 0) {
    return <EmptyState title={STAY_PRIVATE.noProtocols} />
  }
  if (choices.from.length === 0) {
    return (
      <EmptyState
        title={STAY_PRIVATE.noAdversary.title}
        body={STAY_PRIVATE.noAdversary.body}
        action={
          <ActionButton
            onClick={() =>
              onChange({ ...choices, from: getDefaultFrom(adversaries) })
            }
          >
            {STAY_PRIVATE.noAdversary.action}
          </ActionButton>
        }
      />
    )
  }

  return (
    <>
      {grouped === 0 ? (
        <EmptyState
          title={getAllFilteredTitle(choices.asset, choices.chain)}
          body={STAY_PRIVATE.allFiltered.body}
          action={
            <ActionButton
              onClick={() =>
                onChange({ ...choices, asset: undefined, chain: undefined })
              }
            >
              {STAY_PRIVATE.allFiltered.action}
            </ActionButton>
          }
        />
      ) : (
        <>
          {matches.groups.private.length === 0 && <NoFullMatch {...props} />}
          {MATCH_GROUP_IDS.map((id) => (
            <MatchGroup key={id} id={id} rows={matches.groups[id]} {...props} />
          ))}
        </>
      )}
      <FilteredList
        title={STAY_PRIVATE.excludedTitle}
        items={matches.excluded}
        // Open when it is all there is, so the empty state's "below" is visible.
        defaultOpen={grouped === 0}
        {...props}
      />
      <FilteredList
        title={STAY_PRIVATE.uncheckedTitle}
        items={matches.unchecked}
        defaultOpen={grouped === 0}
        {...props}
      />
    </>
  )
}

/** The dot colours and the two marks that qualify them, once for every row. */
function Legend() {
  const { legend } = STAY_PRIVATE
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-paragraph-12 text-secondary">
      {(['good', 'warning', 'bad'] as const).map((sentiment) => (
        <li key={sentiment} className="inline-flex items-center gap-1.5">
          <PrivacySentimentDot sentiment={sentiment} className="size-2.5!" />
          {legend[sentiment]}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span className="size-2.5 shrink-0 rounded-full border-2 border-secondary" />
        {legend.unrated}
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span className="size-2.5 shrink-0 rounded-full bg-secondary opacity-40" />
        {legend.notChosen}
      </li>
    </ul>
  )
}

function EmptyState({
  title,
  body,
  action,
  tone = 'neutral',
  children,
}: {
  title: string
  body?: string
  action?: ReactNode
  tone?: 'neutral' | 'warning'
  children?: ReactNode
}) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-start gap-2 rounded-xl border border-dashed px-4 py-4 md:px-5',
        tone === 'warning'
          ? 'border-yellow-700/40 bg-yellow-700/10'
          : 'border-divider bg-surface-secondary/40',
      )}
    >
      <p className="font-bold text-heading-16">{title}</p>
      {body && <p className="text-paragraph-14 text-secondary">{body}</p>}
      {children}
      {action}
    </div>
  )
}

function ActionButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-brand px-3 py-1.5 font-bold text-brand text-label-value-13 transition-colors hover:bg-brand/10',
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * Nothing is private from everyone chosen. Says so first, then offers each
 * single change to the choices that would give a full match, with its count.
 */
function NoFullMatch({
  protocols,
  adversaries,
  choices,
  waitWindowDays,
  matches,
  onChange,
}: Props) {
  const relaxations = getChoiceRelaxations(protocols, adversaries, choices)
  const uncovered = getUncoveredAdversaries(matches)
  return (
    <EmptyState
      tone="warning"
      title={STAY_PRIVATE.noFullMatch.title}
      // Without a change to offer, which adversaries block a match is the answer.
      body={
        relaxations.length > 0
          ? STAY_PRIVATE.noFullMatch.withRelaxations
          : uncovered.length > 0
            ? getUncoveredText(uncovered.map((a) => a.label.toLowerCase()))
            : STAY_PRIVATE.noFullMatch.withoutRelaxations
      }
    >
      {relaxations.length > 0 && uncovered.length > 0 && (
        <p className="text-paragraph-14">
          {getUncoveredText(uncovered.map((a) => a.label.toLowerCase()))}
        </p>
      )}
      {relaxations.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {relaxations.map((relaxation) => (
            <li key={getRelaxationLabel(relaxation, waitWindowDays)}>
              <ActionButton
                onClick={() => onChange(relaxation.next)}
                className="bg-surface-primary"
              >
                {getRelaxationLabel(relaxation, waitWindowDays)}
                <span className="rounded-full bg-brand/15 px-1.5 py-0.5 font-medium text-2xs">
                  {getMatchCountText(relaxation.matches)}
                </span>
              </ActionButton>
            </li>
          ))}
        </ul>
      )}
    </EmptyState>
  )
}

function getRelaxationLabel(
  relaxation: ChoiceRelaxation,
  waitWindowDays: number,
) {
  switch (relaxation.kind) {
    case 'drop':
      return `Leave out the ${relaxation.adversary.label.toLowerCase()}`
    case 'accept':
      return ADVICE_EFFORTS[relaxation.effort].label(waitWindowDays)
    case 'clearFilters':
      return STAY_PRIVATE.allFiltered.action
  }
}

function MatchGroup({
  id,
  rows,
  ...props
}: Props & {
  id: MatchGroupId
  rows: ProtocolMatch<PrivacyAdviceProtocol>[]
}) {
  const copy: { title: string; note?: string } = STAY_PRIVATE.groups[id]
  // An empty group is noise: the summary or the no-match notice already says so.
  if (rows.length === 0) return null
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h3 className="flex items-center gap-2 font-bold text-heading-16">
          <PrivacySentimentDot sentiment={GROUP_SENTIMENT[id]} />
          {copy.title}
          <span className="rounded-full bg-surface-secondary px-1.5 py-0.5 font-medium text-2xs text-secondary">
            {rows.length}
          </span>
        </h3>
        {copy.note && (
          <p className="mt-1 text-paragraph-13 text-secondary">{copy.note}</p>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <ProtocolRow
            key={row.protocol.slug}
            protocol={row.protocol}
            {...props}
          >
            <RowSummary
              row={row}
              from={props.choices.from}
              waitWindowDays={props.waitWindowDays}
            />
          </ProtocolRow>
        ))}
      </ul>
    </section>
  )
}

/**
 * A protocol with its setup toggle. The setup opens in place and the row
 * scrolls to its top, since rows above may have closed.
 */
function ProtocolRow({
  protocol,
  reason,
  children,
  choices,
  adversaries,
  waitWindowDays,
  selected,
  onSelect,
}: Props & {
  protocol: PrivacyAdviceProtocol
  /** Why a filter ruled it out, for the compact rows under the groups. */
  reason?: string
  children?: ReactNode
}) {
  const isOpen = protocol.slug === selected
  const ref = useRef<HTMLLIElement>(null)
  const setupId = `setup-${protocol.slug}`

  useEffect(() => {
    if (!isOpen) return
    const row = ref.current
    if (!row) return
    // Only when the row's top is off screen: a visible row should not jump.
    const { top } = row.getBoundingClientRect()
    if (top < 0 || top > window.innerHeight * 0.6) {
      row.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [isOpen])

  return (
    <li
      ref={ref}
      className={cn(
        'scroll-mt-4 rounded-xl border border-divider transition-colors',
        isOpen && 'border-brand/60 shadow-sm',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-2',
          reason ? 'px-3 py-2' : 'p-3 md:p-4',
        )}
      >
        {/* The toggle shares the name's line, so the summary below gets the full width. */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <ProtocolName protocol={protocol} />
            {reason && (
              <span className="text-paragraph-13 text-secondary">{reason}</span>
            )}
          </div>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={setupId}
            onClick={() => onSelect(isOpen ? undefined : protocol.slug)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-bold text-label-value-13 transition-colors',
              isOpen
                ? 'border-brand bg-brand text-primary-invert'
                : 'border-divider hover:border-brand hover:text-brand',
            )}
          >
            {isOpen ? STAY_PRIVATE.hideSetup : STAY_PRIVATE.seeSetup}
            <ChevronIcon
              className={cn(
                'size-3 fill-current transition-transform',
                isOpen && 'rotate-180',
              )}
            />
          </button>
        </div>
        {children}
      </div>
      {isOpen && (
        <div
          id={setupId}
          className="border-divider border-t px-3 pt-4 pb-4 md:px-4"
        >
          <SetupDetails
            protocol={protocol}
            accepts={choices.accepts}
            from={choices.from}
            adversaries={adversaries}
            waitWindowDays={waitWindowDays}
          />
        </div>
      )}
    </li>
  )
}

function ProtocolName({ protocol }: { protocol: PrivacyAdviceProtocol }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <img
        src={protocol.icon}
        alt=""
        width={24}
        height={24}
        className="size-6 rounded-full"
      />
      <CustomLink
        href={protocol.href}
        underline={false}
        className="font-bold text-label-value-16 text-primary hover:underline"
      >
        {protocol.name}
      </CustomLink>
      <span className="rounded-sm bg-surface-secondary px-1.5 py-0.5 font-medium text-2xs text-secondary">
        {protocol.categoryLabel}
      </span>
      {protocol.isUnderReview && (
        <span className="rounded-sm bg-yellow-700/20 px-1.5 py-0.5 font-medium text-2xs">
          Under review
        </span>
      )}
    </div>
  )
}

/** The promise, the rating behind the group, and what the path asks for. */
function RowSummary({
  row,
  from,
  waitWindowDays,
}: {
  row: ProtocolMatch<PrivacyAdviceProtocol>
  from: PrivacyAdversaryId[]
  waitWindowDays: number
}) {
  const { protocol, path } = row
  const outside = getOutsideNames(path.taken)
  const waits = path.taken.some((step) => step.randomWait)
  const hrefOf = (id: PrivacyAdversaryId) =>
    `${protocol.href}#${getPrivacyAdversaryBlockId(id)}`

  return (
    <>
      <p className="text-paragraph-14 text-secondary">{protocol.promise}</p>
      {protocol.redWarning && (
        <WarningBar color="red" text={protocol.redWarning} />
      )}
      {/* Every adversary in rosette order, the unchosen faded, so rows line up. */}
      <ul className="flex flex-wrap gap-1.5">
        {path.adversaries.map((a) => {
          const isChosen = from.includes(a.adversary.id)
          return (
            <li
              key={a.adversary.id}
              title={isChosen ? undefined : STAY_PRIVATE.notChosenLabel}
              className={cn(
                'inline-flex items-center gap-1 rounded-full bg-surface-secondary/70 px-2 py-1 text-label-value-13',
                !isChosen && 'bg-transparent opacity-50',
              )}
            >
              <PrivacyAdversaryLink
                adversary={a.adversary}
                href={hrefOf(a.adversary.id)}
                sentiment={a.status === 'unrated' ? undefined : a.sentiment}
              />
              {a.status === 'unrated' && isChosen && (
                <span className="text-secondary">
                  · {STAY_PRIVATE.needsLabel} {a.skipped.join(', ')}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-paragraph-13">
        <Meta label={STAY_PRIVATE.anonymitySetLabel}>
          {protocol.anonymitySet.status === 'available' ? (
            formatInteger(protocol.anonymitySet.value)
          ) : (
            <span className="text-secondary">no count</span>
          )}
        </Meta>
        <Meta label={STAY_PRIVATE.outsideLabel}>
          {outside.length > 0
            ? outside.join(', ')
            : STAY_PRIVATE.nothingOutside}
        </Meta>
        {waits && <Meta label="Timing">{getWaitText(waitWindowDays)}</Meta>}
        {protocol.tvsUsd !== undefined && (
          <Meta label="Value secured">
            {formatCurrency(protocol.tvsUsd, 'usd')}
          </Meta>
        )}
      </dl>
    </>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-1">
      <dt className="text-secondary">{label}:</dt>
      <dd>{children}</dd>
    </div>
  )
}

function FilteredList({
  title,
  items,
  defaultOpen,
  ...props
}: Props & {
  title: string
  items: { protocol: PrivacyAdviceProtocol; reason: string }[]
  defaultOpen: boolean
}) {
  if (items.length === 0) return null
  // A protocol opened from a link must be visible, so its list starts open.
  const holdsSelected = items.some((i) => i.protocol.slug === props.selected)
  return (
    <details
      open={defaultOpen || holdsSelected || undefined}
      className="group rounded-xl border border-divider"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 font-bold text-label-value-14 [&::-webkit-details-marker]:hidden">
        <span>
          {title}{' '}
          <span className="font-medium text-secondary">({items.length})</span>
        </span>
        <ChevronIcon className="size-3 fill-current transition-transform group-open:rotate-180" />
      </summary>
      <ul className="flex flex-col gap-2 px-3 pb-3">
        {items.map(({ protocol, reason }) => (
          <ProtocolRow
            key={protocol.slug}
            protocol={protocol}
            reason={reason}
            {...props}
          />
        ))}
      </ul>
    </details>
  )
}
