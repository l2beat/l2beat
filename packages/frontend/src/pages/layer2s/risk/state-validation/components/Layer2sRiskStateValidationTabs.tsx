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
  Layer2sRiskStateValidationNoProofsEntry,
  Layer2sRiskStateValidationOptimisticEntry,
  Layer2sRiskStateValidationValidityEntry,
} from '~/server/features/layer2s/risks/state-validation/getLayer2sRiskStateValidationEntries'
import {
  Layer2sRiskNoProofsTable,
  Layer2sRiskOptimisticTable,
  Layer2sRiskValidityTable,
} from './table/Layer2sRiskStateValidationTable'

type Props = {
  validity: Layer2sRiskStateValidationValidityEntry[]
  optimistic: Layer2sRiskStateValidationOptimisticEntry[]
  noProofs: Layer2sRiskStateValidationNoProofsEntry[]
}

export function Layer2sRiskStateValidationTabs({
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
            <Layer2sRiskValidityTable entries={filteredValidity} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="optimistic">
            <Layer2sRiskOptimisticTable entries={filteredOptimistic} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="noProofs">
            <Layer2sRiskNoProofsTable entries={filteredNoProofs} />
          </DirectoryTabsContent>
        </TableSortingProvider>
      </DirectoryTabs>
    </>
  )
}
