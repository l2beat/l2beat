import { CountBadge } from '~/components/badge/CountBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { groupByPrivacyType } from '../privacySummaryViews'
import { PrivacyBestPracticesBanner } from './PrivacyBestPracticesBanner'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/**
 * V2 and V3: every kind of privacy at once, as a 2x2 grid of compact tables
 * instead of tabs. There are three kinds, so the best practices banner takes
 * the fourth cell rather than repeating under the grid.
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
  return (
    // Three shared rows - heading, description, table - so both cards of a row
    // start their table on the same line whatever their description runs to.
    <div className="mt-4 grid gap-4 xl:grid-cols-2 xl:grid-rows-[auto_auto_1fr]">
      {groupByPrivacyType(entries).map((group) => (
        <PrimaryCard
          key={group.field}
          // gap-0: the subgrid would otherwise inherit the grid's gap-4
          // between the heading, the description and the table.
          className="flex min-w-0 flex-col xl:row-span-3 xl:grid xl:grid-rows-subgrid xl:gap-0"
        >
          <h2 className="flex items-center gap-2 font-bold text-heading-16 md:text-heading-20">
            {group.label}
            <CountBadge>{group.entries.length}</CountBadge>
          </h2>
          {/* Spaced like the interop widgets: heading, subtitle, content. */}
          <p className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
            {group.shortDescription}
          </p>
          {/* The header plus five rows, then it scrolls, so a long table
              cannot stretch the card past the one beside it. */}
          <div className="mt-2 max-h-[324px] min-w-0 overflow-y-auto">
            <PrivacySummaryTable
              view={view}
              entries={group.entries}
              hiddenColumns={group.hiddenColumns}
              compact
            />
          </div>
        </PrimaryCard>
      ))}
      <PrivacyBestPracticesBanner
        backgroundImage={bestPracticesBannerImageUrl}
        backgroundFit="stretch"
        className="mt-0 h-full min-h-[200px] xl:row-span-3"
      />
    </div>
  )
}
