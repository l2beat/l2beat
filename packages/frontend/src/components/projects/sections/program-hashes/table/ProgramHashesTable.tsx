import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { StateValidationProgramHashData } from '../ProgramHashesSection'
import { programHashesColumns } from './columns'

export type ProgramHashRow = StateValidationProgramHashData & BasicTableRow

interface Props {
  entries: ProgramHashRow[]
}

export function ProgramHashesTable({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns: programHashesColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [],
    },
  })

  return <BasicTable table={table} />
}
