import type { PrivacyAdversary } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { PrivacySentimentDot } from '~/pages/privacy/PrivacySentimentDot'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { cn } from '~/utils/cn'
import {
  ALL_CRITERIA,
  type FilteredProtocol,
  type ProtocolRanking,
  type RankedProtocol,
} from '../rankProtocols'
import {
  formatCriterionValue,
  formatTradeOff,
  getRankedByText,
  STAY_PRIVATE,
} from '../stayPrivateCopy'

/**
 * Every protocol that meets the filters, best first, with the values that
 * place it and what it trades off. The ones filtered out stay listed, with why.
 */
export function ProtocolRankingCard({
  ranking,
  adversaries,
  selected,
  onSelect,
}: {
  ranking: ProtocolRanking<PrivacyAdviceProtocol>
  adversaries: PrivacyAdversary[]
  selected: string | undefined
  onSelect: (slug: string) => void
}) {
  return (
    <PrimaryCard>
      <h2 className="flex items-center gap-2.5 font-bold text-heading-18 md:text-heading-20">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-label-12">
          2
        </span>
        {STAY_PRIVATE.rankingQuestion}
      </h2>
      <p className="mt-2 text-paragraph-15">
        <span className="font-bold">{STAY_PRIVATE.rankedBy}:</span>{' '}
        {getRankedByText(ranking.order)}
      </p>
      <ul className="mt-1 list-disc pl-5 text-paragraph-13 text-secondary">
        {STAY_PRIVATE.rankingNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      {ranking.ranked.length === 0 ? (
        <p className="mt-4 text-paragraph-15">{STAY_PRIVATE.noneQualify}</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-2">
          {ranking.ranked.map((row) => (
            <RankedRow
              key={row.protocol.slug}
              row={row}
              order={ranking.order}
              adversaries={adversaries}
              isSelected={row.protocol.slug === selected}
              onSelect={onSelect}
            />
          ))}
        </ol>
      )}

      <FilteredList
        title={STAY_PRIVATE.excludedTitle}
        items={ranking.excluded}
        onSelect={onSelect}
      />
      <FilteredList
        title={STAY_PRIVATE.uncheckedTitle}
        items={ranking.unchecked}
        onSelect={onSelect}
      />
    </PrimaryCard>
  )
}

function RankedRow({
  row,
  order,
  adversaries,
  isSelected,
  onSelect,
}: {
  row: RankedProtocol<PrivacyAdviceProtocol>
  order: ProtocolRanking<PrivacyAdviceProtocol>['order']
  adversaries: PrivacyAdversary[]
  isSelected: boolean
  onSelect: (slug: string) => void
}) {
  const { protocol, rank, tradeOffs } = row
  return (
    <li
      className={cn(
        'grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-lg border border-divider p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]',
        isSelected && 'border-brand bg-brand/5',
      )}
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-tertiary font-bold text-label-14"
        aria-label={`Rank ${rank}`}
      >
        {rank}
      </span>
      <div className="flex min-w-0 grow flex-col gap-1.5">
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
          {rank === 1 && (
            <span className="rounded-sm bg-surface-tertiary px-1.5 py-0.5 font-medium text-2xs">
              {STAY_PRIVATE.bestFit}
            </span>
          )}
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-paragraph-14">
          {/* The ranking's values first, in tie-break order; the rest back the trade-offs. */}
          {order.map((id) => (
            <span key={id} className="font-bold">
              {formatCriterionValue(id, protocol)}
            </span>
          ))}
          {ALL_CRITERIA.filter((id) => !order.includes(id)).map((id) => (
            <span key={id} className="text-secondary">
              {formatCriterionValue(id, protocol)}
            </span>
          ))}
          <span className="inline-flex items-center gap-1" title="Ratings">
            {adversaries.map((adversary) => (
              <span key={adversary.id} title={adversary.label}>
                <PrivacySentimentDot
                  sentiment={protocol.sentiments[adversary.id]}
                  className="size-2.5!"
                />
              </span>
            ))}
          </span>
          {protocol.tvsUsd !== undefined && (
            <span className="text-secondary">
              {formatCurrency(protocol.tvsUsd, 'usd')} secured
            </span>
          )}
        </div>
        <p className="text-paragraph-13">
          <span className="text-secondary">{STAY_PRIVATE.tradeOffsLabel}:</span>{' '}
          {tradeOffs.length > 0
            ? tradeOffs.map(formatTradeOff).join(' · ')
            : STAY_PRIVATE.noTradeOffs}
        </p>
      </div>
      <SelectButton
        slug={protocol.slug}
        isSelected={isSelected}
        onSelect={onSelect}
        className="col-start-2 self-start justify-self-start sm:col-start-3 sm:row-start-1"
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
    <details className="mt-4 text-paragraph-14">
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
      {isSelected ? STAY_PRIVATE.stepsShown : STAY_PRIVATE.seeSteps}
    </button>
  )
}
