import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type {
  ScalingRiskStateValidationNoProofsEntry,
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import {
  ScalingRiskNoProofsTable,
  ScalingRiskOptimisticTable,
  ScalingRiskValidityTable,
} from './table/ScalingRiskStateValidationTable'

type Props = {
  validity: ScalingRiskStateValidationValidityEntry[]
  optimistic: ScalingRiskStateValidationOptimisticEntry[]
  noProofs: ScalingRiskStateValidationNoProofsEntry[]
}

export function ScalingRiskStateValidationTabs({
  validity,
  optimistic,
  noProofs,
}: Props) {
  const filterEntries = useFilterEntries()

  const filteredValidity = validity.filter(filterEntries)
  const filteredOptimistic = optimistic.filter(filterEntries)
  const filteredNoProofs = noProofs.filter(filterEntries)

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <TableFilters
        className="max-md:mt-4 max-md:px-4"
        entries={[...validity, ...optimistic, ...noProofs]}
      />
      <DirectoryTabs defaultValue="validity">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="validity">
            Validity <CountBadge>{filteredValidity.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="optimistic">
            Optimistic <CountBadge>{filteredOptimistic.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="noProofs">
            No Proofs <CountBadge>{filteredNoProofs.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validity">
            <ScalingRiskValidityTable entries={filteredValidity} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="optimistic">
            <ScalingRiskOptimisticTable entries={filteredOptimistic} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="noProofs">
            <ScalingRiskNoProofsTable entries={filteredNoProofs} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
