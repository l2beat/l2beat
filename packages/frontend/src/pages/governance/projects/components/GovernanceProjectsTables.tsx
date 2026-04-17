import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { GovernanceProjectEntry } from '~/server/features/governance/getGovernanceProjectsEntries'
import { GovernanceProjectsTable } from './table/GovernanceProjectsTable'

type Props = TabbedScalingEntries<GovernanceProjectEntry>

export function GovernanceProjectsTables(props: Props) {
  const filterEntries = useFilterEntries()

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const initialSort = { id: '#', desc: false }

  return (
    <>
      <TableFilters
        className="max-md:mt-4 max-md:px-4"
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
          ...props.notReviewed,
        ]}
      />

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
            Others <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <GovernanceProjectsTable entries={entries.rollups} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <GovernanceProjectsTable
              entries={entries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <OthersInfo />
            <GovernanceProjectsTable entries={entries.others} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
