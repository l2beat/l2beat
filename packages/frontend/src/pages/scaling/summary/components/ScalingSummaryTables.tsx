import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  NotReviewedInfo,
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import { ExcludeAssociatedTokensCheckbox } from '~/pages/scaling/components/ExcludeAssociatedTokensCheckbox'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import type { TabbedScalingEntries } from '../../utils/groupByScalingTabs'
import { ScalingSummaryNotReviewedTable } from './table/ScalingSummaryNotReviewedTable'
import { ScalingSummaryOthersTable } from './table/ScalingSummaryOthersTable'
import { ScalingSummaryRollupsTable } from './table/ScalingSummaryRollupsTable'
import { ScalingSummaryValidiumsAndOptimiumsTable } from './table/ScalingSummaryValidiumsAndOptimiumsTable'

type Props = TabbedScalingEntries<ScalingSummaryEntry>
export function ScalingSummaryTables(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    notReviewed: props.notReviewed.filter(filterEntries),
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <HorizontalSeparator className="my-4 max-md:hidden" />
      <div className="mr-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
        <TableFilters
          entries={[
            ...props.rollups,
            ...props.validiumsAndOptimiums,
            ...props.others,
            ...props.notReviewed,
          ]}
        />
        <ExcludeAssociatedTokensCheckbox />
      </div>
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others
            <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
          {entries.notReviewed.length > 0 && (
            <DirectoryTabsTrigger value="notReviewed">
              Not reviewed
              <CountBadge>{entries.notReviewed.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingSummaryRollupsTable entries={entries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingSummaryValidiumsAndOptimiumsTable
              entries={entries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <OthersInfo />
            <ScalingSummaryOthersTable entries={entries.others} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="notReviewed">
            <NotReviewedInfo />
            <ScalingSummaryNotReviewedTable entries={entries.notReviewed} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
