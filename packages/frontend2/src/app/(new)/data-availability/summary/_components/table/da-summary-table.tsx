'use client'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/app/_components/table/table'
import { TableFacetedFilter } from '~/app/_components/table/table-faceted-filter'
import { TableToolbar } from '~/app/_components/table/table-toolbar'
import { useTable } from '~/hooks/use-table'
import { columns } from './columns'
import { type RouterOutputs } from '~/trpc/react'

interface Props {
  items: RouterOutputs['dataAvailability']['summary']
}

export function DaSummaryTable({ items }: Props) {
  const table = useTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <>
      <TableToolbar>
        <TableFacetedFilter
          title="DA Layer"
          column={table.getColumn('daLayer')}
        />
        <TableFacetedFilter
          title="Layer type"
          column={table.getColumn('layerType')}
        />
      </TableToolbar>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  sorting={
                    header.column.getCanSort()
                      ? {
                          direction: header.column.getIsSorted(),
                          nextDirection: header.column.getNextSortingOrder(),
                        }
                      : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableHeaderRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const hash = cell.column.columnDef.meta?.hash
                const href = hash
                  ? `/data-availability/projects/${row.original.slug}#${hash}`
                  : `/data-availability/projects/${row.original.slug}`
                return (
                  <TableCell key={cell.id} href={href}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
