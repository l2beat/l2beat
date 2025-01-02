import { ProjectId } from '@l2beat/shared-pure'
import {
  type Row,
  type RowModel,
  type Table,
  getSortedRowModel,
} from '@tanstack/react-table'
import { type CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'

// Check https://github.com/TanStack/table/blob/main/packages/table-core/src/utils/getSortedRowModel.ts for reference
// This is a getSortedRowModel wrapper that checks if the row is ethereum and puts it first
export function getEthereumFirstSortedRowModel<
  TData extends CommonProjectEntry,
>(): ReturnType<typeof getSortedRowModel<TData>> {
  return (table: Table<TData>) => {
    const sortedRowModel = getSortedRowModel<TData>()(table)()
    const { rows, rowsById } = sortedRowModel

    const sortedFlatRows: Row<TData>[] = []
    const sortData = (rows: Row<TData>[]) => {
      const sortedData = rows.map((row) => ({ ...row }))
      sortedData.sort((a: Row<TData>, b: Row<TData>) => {
        if (a.original.id === ProjectId.ETHEREUM) {
          return -1
        }
        if (b.original.id === ProjectId.ETHEREUM) {
          return 1
        }
        return 0
      })

      sortedData.forEach((row) => {
        sortedFlatRows.push(row)
        if (row.subRows?.length) {
          row.subRows = sortData(row.subRows)
        }
      })

      return sortedData
    }

    const sortedRows = sortData(rows)

    return (): RowModel<TData> => {
      return {
        rows: sortedRows,
        flatRows: sortedFlatRows,
        rowsById: rowsById,
      }
    }
  }
}
