'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../_components/scaling-tvl-filters'
import { OthersComingSoonNotice } from './table/others-coming-soon-notice'
import { ScalingSummaryOthersTable } from './table/scaling-summary-others-table'
import { ScalingSummaryRollupsTable } from './table/scaling-summary-rollups-table'
import { ScalingSummaryValidiumsAndOptimiumsTable } from './table/scaling-summary-validiums-and-optimiums-table'

type Props = RecategorisedScalingEntry<ScalingSummaryEntry>
export function ScalingSummaryTables(props: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others?.filter(includeFilters) ?? [],
  }

  return (
    <>
      <HorizontalSeparator className="my-4 !border-divider max-md:hidden" />
      <ScalingTvlFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        excludeAssociatedTokensClassName="max-md:ml-4 max-md:mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums-and-optimiums">
            Validiums & Optimiums
            <CountBadge>
              {filteredEntries.validiumsAndOptimiums.length}
            </CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others
            {filteredEntries.others.length > 0 && (
              <CountBadge>{filteredEntries.others.length}</CountBadge>
            )}
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <DirectoryTabsContent value="rollups">
          <ScalingSummaryRollupsTable entries={filteredEntries.rollups} />
        </DirectoryTabsContent>
        <DirectoryTabsContent value="validiums-and-optimiums">
          <ScalingSummaryValidiumsAndOptimiumsTable
            entries={filteredEntries.validiumsAndOptimiums}
          />
        </DirectoryTabsContent>
        <DirectoryTabsContent value="others">
          {filteredEntries.others.length > 0 ? (
            <ScalingSummaryOthersTable entries={filteredEntries.others} />
          ) : (
            <OthersComingSoonNotice />
          )}
        </DirectoryTabsContent>
      </DirectoryTabs>
    </>
  )
}
