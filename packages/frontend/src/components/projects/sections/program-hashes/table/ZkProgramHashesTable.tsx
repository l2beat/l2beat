import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { StateValidationZkProgramHashData } from '../ProgramHashesSection'
import { zkProgramHashesColumns } from './columns'

export type ZkProgramHashRow = StateValidationZkProgramHashData & BasicTableRow

interface Props {
  entries: ZkProgramHashRow[]
}

export function ZkProgramHashesTable({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns: zkProgramHashesColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [],
    },
  })

  return <BasicTable table={table} />
}
