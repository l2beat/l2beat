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
import { verifiersColumns } from './columns'

export type VerifierRow =
  VerifiersSectionProps['proofSystemVerifiers'][number]['verifierHashes'][number] &
    BasicTableRow

interface Props {
  entries: VerifierRow[]
}
export function VerifiersTable({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns: verifiersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.hash,
    getRowCanExpand: () => true,
  })
  return (
    <BasicTable
      table={table}
      renderSubComponent={({ row }) => (
        <VerifierRowDetails verifierHash={row.original} />
      )}
    />
  )
}
