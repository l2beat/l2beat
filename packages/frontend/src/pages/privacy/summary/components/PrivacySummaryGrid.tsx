import { CountBadge } from '~/components/badge/CountBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { cn } from '~/utils/cn'
import {
  groupByPrivacyType,
  type PrivacyTypeGroup,
} from '../privacySummaryViews'
import { PrivacyBestPracticesBanner } from './PrivacyBestPracticesBanner'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/**
 * V1 and V3: every kind of privacy at once, as compact tables instead of tabs.
 * V1 puts link privacy across the top and the other two below it, with the
 * best practices banner under everything as on main. V3 is a 2x2 grid where,
 * with three kinds, the banner takes the fourth cell.
 */
export function PrivacySummaryGrid({
  entries,
  view,
  bestPracticesBannerImageUrl,
}: {
  entries: PrivacySummaryEntry[]
  /** `gridSplit` splits the protocol risks off into columns of their own. */
  view: 'grid' | 'gridSplit'
  bestPracticesBannerImageUrl: string
}) {
  const groups = groupByPrivacyType(entries)

  if (view === 'gridSplit') {
    const top = groups.filter((group) => group.field === 'linkage')
    const bottom = groups.filter((group) => group.field !== 'linkage')
    return (
      <>
        <div className="mt-4 flex flex-col gap-4">
          {top.map((group) => (
            <PrivacyTypeCard key={group.field} group={group} view={view} />
          ))}
          {/* No height cap: the row grows to the longer table and the card
              beside it stretches to match. */}
          <PrivacyTypeCardRow>
            {bottom.map((group) => (
              <PrivacyTypeCard
                key={group.field}
                group={group}
                view={view}
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

  return (
    <PrivacyTypeCardRow className="mt-4">
      {groups.map((group) => (
        <PrivacyTypeCard
          key={group.field}
          group={group}
          view={view}
          className={SUBGRID_CARD_CLASS_NAME}
          // The header plus five rows, then it scrolls, so a long table
          // cannot stretch the card past the one beside it.
          tableClassName="max-h-[324px] overflow-y-auto"
        />
      ))}
      <PrivacyBestPracticesBanner
        backgroundImage={bestPracticesBannerImageUrl}
        backgroundFit="stretch"
        className="mt-0 h-full min-h-[200px] xl:row-span-3"
      />
    </PrivacyTypeCardRow>
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
function PrivacyTypeCardRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-4 xl:grid-cols-2 xl:grid-rows-[auto_auto_1fr]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function PrivacyTypeCard({
  group,
  view,
  className,
  tableClassName,
}: {
  group: PrivacyTypeGroup
  view: 'grid' | 'gridSplit'
  className?: string
  tableClassName?: string
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
      <div className={cn('mt-2 min-w-0', tableClassName)}>
        <PrivacySummaryTable
          view={view}
          entries={group.entries}
          hiddenColumns={group.hiddenColumns}
          compact
        />
      </div>
    </PrimaryCard>
  )
}
