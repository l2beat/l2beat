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
  L2RiskStateValidationNoProofsEntry,
  L2RiskStateValidationOptimisticEntry,
  L2RiskStateValidationValidityEntry,
} from '~/server/features/layer2s/risks/state-validation/getL2RiskStateValidationEntries'
import {
  L2RiskNoProofsTable,
  L2RiskOptimisticTable,
  L2RiskValidityTable,
} from './table/L2RiskStateValidationTable'

type Props = {
  validity: L2RiskStateValidationValidityEntry[]
  optimistic: L2RiskStateValidationOptimisticEntry[]
  noProofs: L2RiskStateValidationNoProofsEntry[]
}

export function L2RiskStateValidationTabs({
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
            <L2RiskValidityTable entries={filteredValidity} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="optimistic">
            <L2RiskOptimisticTable entries={filteredOptimistic} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="noProofs">
            <L2RiskNoProofsTable entries={filteredNoProofs} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
