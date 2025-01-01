'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { featureFlags } from '~/consts/feature-flags'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingSummaryFilters } from '../../_components/scaling-summary-filters'
import { OthersComingSoonNotice } from './table/others-coming-soon-notice'
import { ScalingSummaryOthersTable } from './table/scaling-summary-others-table'
import { ScalingSummaryRollupsTable } from './table/scaling-summary-rollups-table'
import { ScalingSummaryValidiumsAndOptimiumsTable } from './table/scaling-summary-validiums-and-optimiums-table'

type Props = TabbedScalingEntries<ScalingSummaryEntry>
export function ScalingSummaryTables(props: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <HorizontalSeparator className="my-4 !border-divider max-md:hidden" />
      <ScalingSummaryFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        className="mt-4"
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
            {featureFlags.showOthers && (
              <CountBadge>{filteredEntries.others.length}</CountBadge>
            )}
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingSummaryRollupsTable entries={filteredEntries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingSummaryValidiumsAndOptimiumsTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            {featureFlags.showOthers && filteredEntries.others.length > 0 ? (
              <>
                <OthersInfo />
                <ScalingSummaryOthersTable entries={filteredEntries.others} />
              </>
            ) : (
              <OthersComingSoonNotice />
            )}
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
