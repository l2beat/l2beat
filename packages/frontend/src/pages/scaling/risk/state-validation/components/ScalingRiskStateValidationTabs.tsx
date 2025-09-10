import { useState } from 'react'
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
import type {
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { ScalingRiskStateValidationTable } from './table/ScalingRiskStateValidationTable'

type Props = {
  validity: TabbedScalingEntries<ScalingRiskStateValidationValidityEntry>
  optimistic: TabbedScalingEntries<ScalingRiskStateValidationOptimisticEntry>
}

export function ScalingRiskStateValidationTabs({
  validity,
  optimistic,
}: Props) {
  const [tableTab, setTableTab] = useState<'validity' | 'optimistic'>(
    'validity',
  )
  const filterEntries = useFilterEntries()

  const entries = {
    rollups: [...validity.rollups, ...optimistic.rollups].filter(filterEntries),
    validiumsAndOptimiums: [
      ...validity.validiumsAndOptimiums,
      ...optimistic.validiumsAndOptimiums,
    ].filter(filterEntries),
    others: [...validity.others, ...optimistic.others].filter(filterEntries),
  }

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <TableFilters
        entries={[
          ...validity.rollups,
          ...validity.validiumsAndOptimiums,
          ...validity.others,
          ...optimistic.rollups,
          ...optimistic.validiumsAndOptimiums,
          ...optimistic.others,
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
            <ScalingRiskStateValidationTable
              tableTab={tableTab}
              setTableTab={setTableTab}
              validity={validity.rollups}
              optimistic={optimistic.rollups}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingRiskStateValidationTable
              tableTab={tableTab}
              setTableTab={setTableTab}
              validity={validity.validiumsAndOptimiums}
              optimistic={optimistic.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="others">
            <OthersInfo />
            <ScalingRiskStateValidationTable
              tableTab={tableTab}
              setTableTab={setTableTab}
              validity={validity.others}
              optimistic={optimistic.others}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
