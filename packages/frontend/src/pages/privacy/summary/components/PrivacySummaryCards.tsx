import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { cn } from '~/utils/cn'
import { getPrivacyAdversariesSentence } from '../../adversaries/privacyAdversaryUi'
import { PrivacyRosetteCell } from '../../rosette/PrivacyRosetteCell'
import { getPrivacyRosetteGroups } from '../../rosette/privacyRosetteSlices'
import type { PrivacySummaryOptionalColumn } from '../privacySummaryViews'
import { AnonymitySetCell } from './AnonymitySetCell'

/**
 * V4: a card per protocol instead of a row. Nothing has to fit a column, so
 * the card can say where the privacy breaks, not just how often - a view for
 * reading about a few protocols rather than scanning many.
 */
export function PrivacySummaryCards({
  entries,
  hiddenColumns,
}: {
  entries: PrivacySummaryEntry[]
  hiddenColumns: PrivacySummaryOptionalColumn[]
}) {
  return (
    // Each card is a subgrid over five shared rows (header, verdict, protocol
    // risks, numbers, attributes), so a section is as tall as the tallest one
    // beside it and the dividers line up across a row of cards.
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry, index) => (
        <PrivacySummaryCard
          key={entry.id}
          entry={entry}
          rank={index + 1}
          showTvl={!hiddenColumns.includes('tvl')}
        />
      ))}
    </div>
  )
}

function PrivacySummaryCard({
  entry,
  rank,
  showTvl,
}: {
  entry: PrivacySummaryEntry
  rank: number
  showTvl: boolean
}) {
  const { held, total } = getPrivacyAdversariesSentence(entry.adversaries)
  const { risks } = getPrivacyRosetteGroups(entry)
  // Where the promise breaks, worst first: the part a table row cannot say.
  const weakPoints = [...entry.adversaries.cells]
    .filter((cell) => cell.sentiment !== 'good')
    .sort((a, b) =>
      a.sentiment === 'bad' ? -1 : b.sentiment === 'bad' ? 1 : 0,
    )

  return (
    <article className="row-span-5 grid grid-rows-subgrid gap-0 rounded-xl border border-divider bg-surface-secondary/60 transition-colors hover:border-brand/40">
      <a href={entry.href} className="flex items-center gap-3 px-5 pt-5 pb-4">
        <img
          src={entry.icon}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full"
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-bold text-heading-18">
            {entry.name}
          </span>
          <span className="truncate text-secondary text-xs">
            {entry.category.label}
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-surface-tertiary px-2 py-0.5 font-bold text-secondary text-xs tabular-nums">
          #{rank}
        </span>
      </a>

      <div className="flex items-start gap-5 px-5 pb-5">
        {/* The rosette's tooltip trigger fills its parent, so the parent is
            what keeps it to the rosette's own width. */}
        <div className="shrink-0">
          <PrivacyRosetteCell
            adversaries={entry.adversaries}
            trustedSetup={entry.trustedSetup}
            exitWindow={entry.exitWindow}
            reproducibility={entry.reproducibility}
            href={entry.href}
            isUnderReview={entry.isUnderReview}
            iconClassName="size-20 md:size-20"
            linkClassName="max-h-none shrink-0 md:mx-0 md:px-0 md:hover:bg-transparent md:dark:hover:bg-transparent"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <SectionLabel>{entry.adversaries.promiseLabel}</SectionLabel>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-[28px] tabular-nums leading-none">
              {held}/{total}
            </span>
            <span className="text-secondary text-sm">adversaries</span>
          </div>
          {weakPoints.length === 0 ? (
            <span className="text-positive text-xs">
              Private against every adversary
            </span>
          ) : (
            <ul className="flex flex-col gap-1 text-xs">
              {weakPoints.map((cell) => (
                <li key={cell.id} className="flex items-center gap-1.5">
                  <TrustedSetupRiskDot
                    risk={cell.sentiment === 'bad' ? 'red' : 'yellow'}
                    size="xs"
                    className="shrink-0"
                  />
                  <span className="truncate">
                    <span className="text-secondary">
                      {cell.sentiment === 'bad' ? 'Exposed to' : 'At risk from'}
                    </span>{' '}
                    <span className="font-medium">
                      {cell.label.toLowerCase()}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Section label="Protocol risks">
        <ul className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1.5 text-[13px] leading-5">
          {risks.slices.map((slice) => (
            <li
              key={slice.id}
              className="col-span-3 grid grid-cols-subgrid items-center"
            >
              <TrustedSetupRiskDot
                risk={slice.risk}
                size="xs"
                className="shrink-0"
              />
              <span className="truncate text-secondary">{slice.label}</span>
              {/* The note sits on the value's line so every row keeps one
                  height and the rows line up across cards. */}
              <span className="flex items-baseline justify-end gap-1.5 whitespace-nowrap">
                {slice.detail?.negative && (
                  <span className="text-[11px] text-negative">
                    {slice.detail.text}
                  </span>
                )}
                <span className="font-medium">{slice.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <dl
          className={cn(
            'grid gap-x-4 gap-y-3',
            showTvl ? 'grid-cols-2 min-[1700px]:grid-cols-4' : 'grid-cols-3',
          )}
        >
          {showTvl && (
            <Stat label="TVL">
              {entry.hasTvl && entry.totalValueLockedUsd !== undefined
                ? formatCurrency(entry.totalValueLockedUsd, 'usd')
                : undefined}
            </Stat>
          )}
          <Stat label="Deposits">
            {entry.totalDeposits === undefined
              ? undefined
              : formatInteger(entry.totalDeposits)}
          </Stat>
          <Stat label="30D vol.">
            {entry.totalValueDeposited30dUsd === undefined
              ? undefined
              : formatCurrency(entry.totalValueDeposited30dUsd, 'usd')}
          </Stat>
          <Stat label="Anon. set">
            <AnonymitySetCell
              anonymitySet={entry.anonymitySet}
              projectName={entry.name}
              align="left"
            />
          </Stat>
        </dl>
      </Section>

      {/* Always rendered, even empty, so every card fills all five rows. */}
      <div className="flex flex-wrap content-start gap-1.5 px-5 pb-5">
        {entry.attributes.map((attribute) => (
          <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
        ))}
      </div>
    </article>
  )
}

function Section({
  label,
  className,
  children,
}: {
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('border-divider border-t px-5 py-3.5', className)}>
      {label && <SectionLabel className="mb-2">{label}</SectionLabel>}
      {children}
    </div>
  )
}

function SectionLabel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'font-medium text-[11px] text-secondary uppercase tracking-wide',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="font-medium text-[11px] text-secondary uppercase tracking-wide">
        {label}
      </dt>
      <dd className="font-bold text-sm tabular-nums">
        {children ?? <span className="font-medium text-secondary">–</span>}
      </dd>
    </div>
  )
}
