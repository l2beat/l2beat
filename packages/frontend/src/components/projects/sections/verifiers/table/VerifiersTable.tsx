import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import {
  VerifierRowDetails,
  type VerifiersSectionProps,
} from '../VerifiersSection'
import { verifiersColumns, verifiersColumnsWithoutActions } from './columns'

export type VerifierRow =
  VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number] &
    BasicTableRow

interface Props {
  entries: VerifierRow[]
  collapsible?: boolean
  stickyHeader?: boolean
}
export function VerifiersTable({
  entries,
  collapsible = true,
  stickyHeader,
}: Props) {
  const table = useTable('VerifiersTable', {
    data: entries,
    columns: collapsible ? verifiersColumns : verifiersColumnsWithoutActions,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // Verifiers that are not deployed yet share the zero hash, and rows with
    // the same id get duplicated when sorting reorders them.
    getRowId: (row, index) => `${row.hash}-${index}`,
    getRowCanExpand: () => true,
    initialState: collapsible ? undefined : { expanded: true },
  })
  return (
    <BasicTable
      table={table}
      stickyHeader={stickyHeader}
      renderSubComponent={({ row }) => (
        <VerifierRowDetails verifierHash={row.original} />
      )}
    />
  )
}
