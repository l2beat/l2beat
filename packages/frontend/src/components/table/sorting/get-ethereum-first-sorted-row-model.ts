import { assert, ProjectId } from '@l2beat/shared-pure'
import {
  type Row,
  type RowModel,
  type SortingFn,
  type Table,
  getMemoOptions,
  memo,
} from '@tanstack/react-table'
import { type CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'

// Check https://github.com/TanStack/table/blob/main/packages/table-core/src/utils/getSortedRowModel.ts for reference
// This is a custom (check "#region Modified code") getSortedRowModel that checks if the row is ethereum and puts it first
export function getEthereumFirstSortedRowModel<
  TData extends CommonProjectEntry,
>(): (table: Table<TData>) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [table.getState().sorting, table.getPreSortedRowModel()],
      (sorting, rowModel) => {
        if (!rowModel.rows.length || !sorting?.length) {
          return rowModel
        }

        const sortingState = table.getState().sorting

        const sortedFlatRows: Row<TData>[] = []

        // Filter out sortings that correspond to non existing columns
        const availableSorting = sortingState.filter((sort) =>
          table.getColumn(sort.id)?.getCanSort(),
        )

        const columnInfoById: Record<
          string,
          {
            sortUndefined?: false | -1 | 1 | 'first' | 'last'
            invertSorting?: boolean
            sortingFn: SortingFn<TData>
          }
        > = {}

        availableSorting.forEach((sortEntry) => {
          const column = table.getColumn(sortEntry.id)
          if (!column) return

          columnInfoById[sortEntry.id] = {
            sortUndefined: column.columnDef.sortUndefined,
            invertSorting: column.columnDef.invertSorting,
            sortingFn: column.getSortingFn(),
          }
        })

        const sortData = (rows: Row<TData>[]) => {
          // This will also perform a stable sorting using the row index
          // if needed.
          const sortedData = rows.map((row) => ({ ...row }))

          sortedData.sort((rowA, rowB) => {
            // #region Modified code
            // Check for Ethereum first - it should always be at the top
            const aIsEthereum = rowA.original.id === ProjectId.ETHEREUM
            const bIsEthereum = rowB.original.id === ProjectId.ETHEREUM
            assert(!aIsEthereum || !bIsEthereum, 'Both rows are Ethereum')
            if (aIsEthereum) return -1
            if (bIsEthereum) return 1
            // #endregion

            // If neither is Ethereum, proceed with normal sorting
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < availableSorting.length; i += 1) {
              const sortEntry = availableSorting[i]!
              const columnInfo = columnInfoById[sortEntry.id]!
              const sortUndefined = columnInfo.sortUndefined
              const isDesc = sortEntry?.desc ?? false

              let sortInt = 0

              // All sorting ints should always return in ascending order
              if (sortUndefined) {
                const aValue = rowA.getValue(sortEntry.id)
                const bValue = rowB.getValue(sortEntry.id)

                const aUndefined = aValue === undefined
                const bUndefined = bValue === undefined

                if (aUndefined || bUndefined) {
                  if (sortUndefined === 'first') return aUndefined ? -1 : 1
                  if (sortUndefined === 'last') return aUndefined ? 1 : -1
                  sortInt =
                    aUndefined && bUndefined
                      ? 0
                      : aUndefined
                        ? sortUndefined
                        : -sortUndefined
                }
              }

              if (sortInt === 0) {
                sortInt = columnInfo.sortingFn(rowA, rowB, sortEntry.id)
              }

              // If sorting is non-zero, take care of desc and inversion
              if (sortInt !== 0) {
                if (isDesc) {
                  sortInt *= -1
                }

                if (columnInfo.invertSorting) {
                  sortInt *= -1
                }

                return sortInt
              }
            }

            return rowA.index - rowB.index
          })

          // If there are sub-rows, sort them
          sortedData.forEach((row) => {
            sortedFlatRows.push(row)
            if (row.subRows?.length) {
              row.subRows = sortData(row.subRows)
            }
          })

          return sortedData
        }

        return {
          rows: sortData(rowModel.rows),
          flatRows: sortedFlatRows,
          rowsById: rowModel.rowsById,
        }
      },
      getMemoOptions(table.options, 'debugTable', 'getSortedRowModel', () =>
        table._autoResetPageIndex(),
      ),
    )
}
