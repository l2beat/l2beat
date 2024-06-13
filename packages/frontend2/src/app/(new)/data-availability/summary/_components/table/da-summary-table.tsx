'use client'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SortingArrows } from '~/app/_components/table/sorting-arrows'
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
import { type DataAvailabilityProvider, columns } from './columns'

interface Props {
  items: DataAvailabilityProvider[]
}

export function DaSummaryTable({ items }: Props) {
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSortingRemoval: false,
    sortDescFirst: true,
    initialState: {
      sorting: [{ id: '#', desc: false }],
    },
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
                >
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <SortingArrows
                      sortDirection={header.column.getIsSorted()}
                      nextSortDirection={header.column.getNextSortingOrder()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </SortingArrows>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
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
