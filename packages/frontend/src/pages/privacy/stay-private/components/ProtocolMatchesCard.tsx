import type { PrivacyAdversaryId } from '@l2beat/config'
import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { PrivacyAdversaryLink } from '~/components/projects/sections/privacy/PrivacyAdviceSteps'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { PrivacySentimentDot } from '~/pages/privacy/PrivacySentimentDot'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { cn } from '~/utils/cn'
import {
  type FilteredProtocol,
  MATCH_GROUP_IDS,
  type MatchGroupId,
  type ProtocolMatch,
  type ProtocolMatches,
} from '../matchProtocols'
import { getOutsideNames } from '../setupTools'
import { getWaitText, STAY_PRIVATE } from '../stayPrivateCopy'

const GROUP_SENTIMENT = {
  private: 'good',
  atRisk: 'warning',
  exposed: 'bad',
} as const satisfies Record<MatchGroupId, string>

/**
 * The protocols of the chosen need in three groups, by our ratings against
 * the adversaries the user chose. No rank: a group says what holds, and the
 * rows show the ratings that put a protocol there.
 */
export function ProtocolMatchesCard({
  matches,
  from,
  waitWindowDays,
  selected,
  onSelect,
}: {
  matches: ProtocolMatches<PrivacyAdviceProtocol>
  from: PrivacyAdversaryId[]
  waitWindowDays: number
  selected: string | undefined
  onSelect: (slug: string) => void
}) {
  return (
    <PrimaryCard>
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        {STAY_PRIVATE.matchesTitle}
      </h2>
      {from.length === 0 ? (
        <p className="mt-3 text-paragraph-15">{STAY_PRIVATE.fromEmpty}</p>
      ) : (
        <>
          <ul className="mt-2 list-disc pl-5 text-paragraph-13 text-secondary">
            {STAY_PRIVATE.matchNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          {MATCH_GROUP_IDS.map((id) => (
            <MatchGroup
              key={id}
              id={id}
              rows={matches.groups[id]}
              from={from}
              waitWindowDays={waitWindowDays}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
      <FilteredList
        title={STAY_PRIVATE.excludedTitle}
        items={matches.excluded}
        onSelect={onSelect}
      />
      <FilteredList
        title={STAY_PRIVATE.uncheckedTitle}
        items={matches.unchecked}
        onSelect={onSelect}
      />
    </PrimaryCard>
  )
}

function MatchGroup({
  id,
  rows,
  from,
  waitWindowDays,
  selected,
  onSelect,
}: {
  id: MatchGroupId
  rows: ProtocolMatch<PrivacyAdviceProtocol>[]
  from: PrivacyAdversaryId[]
  waitWindowDays: number
  selected: string | undefined
  onSelect: (slug: string) => void
}) {
  const copy: { title: string; note?: string; empty?: string } =
    STAY_PRIVATE.groups[id]
  // An empty group is noise, except the first: that nothing holds is the answer.
  if (rows.length === 0 && !copy.empty) return null
  return (
    <section className="mt-6">
      <h3 className="flex items-center gap-2 font-bold text-heading-16">
        <PrivacySentimentDot sentiment={GROUP_SENTIMENT[id]} />
        {copy.title}
        <span className="font-normal text-secondary">({rows.length})</span>
      </h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-paragraph-15">{copy.empty}</p>
      ) : (
        <>
          {copy.note && (
            <p className="mt-1 text-paragraph-13 text-secondary">{copy.note}</p>
          )}
          <ul className="mt-3 flex flex-col gap-2">
            {rows.map((row) => (
              <MatchRow
                key={row.protocol.slug}
                row={row}
                from={from}
                waitWindowDays={waitWindowDays}
                isSelected={row.protocol.slug === selected}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function MatchRow({
  row,
  from,
  waitWindowDays,
  isSelected,
  onSelect,
}: {
  row: ProtocolMatch<PrivacyAdviceProtocol>
  from: PrivacyAdversaryId[]
  waitWindowDays: number
  isSelected: boolean
  onSelect: (slug: string) => void
}) {
  const { protocol, path } = row
  const outside = getOutsideNames(path.taken)
  const waits = path.taken.some((step) => step.randomWait)
  const notChosen = path.adversaries.filter(
    (a) => !from.includes(a.adversary.id),
  )
  const hrefOf = (id: PrivacyAdversaryId) =>
    `${protocol.href}#${getPrivacyAdversaryBlockId(id)}`

  return (
    <li
      className={cn(
        'grid grid-cols-1 gap-x-3 gap-y-2 rounded-lg border border-divider p-3 sm:grid-cols-[minmax(0,1fr)_auto]',
        isSelected && 'border-brand bg-brand/5',
      )}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <img
            src={protocol.icon}
            alt=""
            width={20}
            height={20}
            className="size-5 rounded-full"
          />
          <span className="font-bold text-label-value-16">{protocol.name}</span>
          <span className="text-paragraph-13 text-secondary">
            {protocol.categoryLabel}
          </span>
          {protocol.isUnderReview && (
            <span className="rounded-sm bg-yellow-700/20 px-1.5 py-0.5 font-medium text-2xs">
              Under review
            </span>
          )}
        </div>
        <p className="text-paragraph-13 text-secondary">{protocol.promise}</p>
        {protocol.redWarning && (
          <p className="text-paragraph-13 text-red-300">
            {protocol.redWarning}
          </p>
        )}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-paragraph-14">
          {row.chosen.map((a) => (
            <li key={a.adversary.id} className="inline-flex items-center">
              <PrivacyAdversaryLink
                adversary={a.adversary}
                href={hrefOf(a.adversary.id)}
                sentiment={a.status === 'unrated' ? undefined : a.sentiment}
              />
              {a.status === 'unrated' && (
                <span className="ml-1.5 text-secondary">
                  {STAY_PRIVATE.needsLabel} {a.skipped.join(', ')}
                </span>
              )}
            </li>
          ))}
        </ul>
        {notChosen.length > 0 && (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-paragraph-13 text-secondary">
            <li>{STAY_PRIVATE.notChosenLabel}:</li>
            {notChosen.map((a) => (
              <li key={a.adversary.id} className="opacity-60">
                <PrivacyAdversaryLink
                  adversary={a.adversary}
                  href={hrefOf(a.adversary.id)}
                  sentiment={a.status === 'unrated' ? undefined : a.sentiment}
                />
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-paragraph-13">
          <span>
            <span className="text-secondary">
              {STAY_PRIVATE.anonymitySetLabel}:
            </span>{' '}
            {protocol.anonymitySet.status === 'available'
              ? formatInteger(protocol.anonymitySet.value)
              : 'no count'}
          </span>
          <span>
            <span className="text-secondary">{STAY_PRIVATE.outsideLabel}:</span>{' '}
            {outside.length > 0
              ? outside.join(', ')
              : STAY_PRIVATE.nothingOutside}
          </span>
          {waits && <span>{getWaitText(waitWindowDays)}</span>}
          {protocol.tvsUsd !== undefined && (
            <span className="text-secondary">
              {formatCurrency(protocol.tvsUsd, 'usd')} secured
            </span>
          )}
        </div>
      </div>
      <SelectButton
        slug={protocol.slug}
        isSelected={isSelected}
        onSelect={onSelect}
        className="self-start justify-self-start"
      />
    </li>
  )
}

function FilteredList({
  title,
  items,
  onSelect,
}: {
  title: string
  items: FilteredProtocol<PrivacyAdviceProtocol>[]
  onSelect: (slug: string) => void
}) {
  if (items.length === 0) return null
  return (
    <details className="mt-6 text-paragraph-14">
      <summary className="cursor-pointer font-medium">
        {title} ({items.length})
      </summary>
      <ul className="mt-2 flex flex-col divide-y divide-divider">
        {items.map(({ protocol, reason }) => (
          <li
            key={protocol.slug}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5"
          >
            <span>
              <span className="font-medium">{protocol.name}</span>
              <span className="text-secondary"> · {reason}</span>
            </span>
            <SelectButton slug={protocol.slug} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </details>
  )
}

function SelectButton({
  slug,
  isSelected = false,
  onSelect,
  className,
}: {
  slug: string
  isSelected?: boolean
  onSelect: (slug: string) => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(slug)}
      className={cn(
        'shrink-0 rounded-md border border-divider px-2.5 py-1 font-medium text-label-value-13 hover:bg-surface-secondary aria-pressed:border-brand aria-pressed:text-brand',
        className,
      )}
    >
      {isSelected ? STAY_PRIVATE.setupShown : STAY_PRIVATE.seeSetup}
    </button>
  )
}
