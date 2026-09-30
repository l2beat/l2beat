import { CountBadge } from '~/components/badge/CountBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { cn } from '~/utils/cn'
import { groupByPrivacyType, type PrivacyTypeGroup } from '../privacyTypes'
import { PrivacyBestPracticesBanner } from './PrivacyBestPracticesBanner'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/**
 * Every kind of privacy at once, as compact tables instead of tabs: link
 * privacy across the top, the other two side by side below it, and the best
 * practices banner under everything as on main.
 */
export function PrivacySummaryGrid({
  entries,
  bestPracticesBannerImageUrl,
}: {
  entries: PrivacySummaryEntry[]
  bestPracticesBannerImageUrl: string
}) {
  const groups = groupByPrivacyType(entries)
  const top = groups.filter((group) => group.field === 'linkage')
  const bottom = groups.filter((group) => group.field !== 'linkage')

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        {top.map((group) => (
          <PrivacyTypeCard key={group.field} group={group} />
        ))}
        {/* No height cap: the row grows to the longer table and the card
            beside it stretches to match. */}
        <PrivacyTypeCardRow>
          {bottom.map((group) => (
            <PrivacyTypeCard
              key={group.field}
              group={group}
              className={SUBGRID_CARD_CLASS_NAME}
            />
          ))}
        </PrivacyTypeCardRow>
      </div>
      <PrivacyBestPracticesBanner
        backgroundImage={bestPracticesBannerImageUrl}
      />
    </>
  )
}

// gap-0: the subgrid would otherwise inherit the grid's gap-4 between the
// heading, the description and the table.
const SUBGRID_CARD_CLASS_NAME =
  'xl:row-span-3 xl:grid xl:grid-rows-subgrid xl:gap-0'

/**
 * Two cards a row, sharing three rows - heading, description, table - so both
 * cards of a row start their table on the same line whatever their
 * description runs to.
 */
function PrivacyTypeCardRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2 xl:grid-rows-[auto_auto_1fr]">
      {children}
    </div>
  )
}

function PrivacyTypeCard({
  group,
  className,
}: {
  group: PrivacyTypeGroup
  className?: string
}) {
  return (
    <PrimaryCard className={cn('flex min-w-0 flex-col', className)}>
      <h2 className="flex items-center gap-2 font-bold text-heading-16 md:text-heading-20">
        {group.label}
        <CountBadge>{group.entries.length}</CountBadge>
      </h2>
      {/* Spaced like the interop widgets: heading, subtitle, content. */}
      <p className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        {group.shortDescription}
      </p>
      <div className="mt-2 min-w-0">
        <PrivacySummaryTable
          entries={group.entries}
          hiddenColumns={group.hiddenColumns}
        />
      </div>
    </PrimaryCard>
  )
}
