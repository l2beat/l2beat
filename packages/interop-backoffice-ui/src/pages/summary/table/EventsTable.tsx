import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/core/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { ExportTableCsvButton } from '~/components/table/ExportTableCsvButton'
import { eventsColumns } from './columns'
import type { SummaryEventRow } from './types'

type PageSizeOption = '10' | '25' | '50' | '100' | 'all'

function toPageSize(option: PageSizeOption, rowsCount: number) {
  if (option === 'all') {
    return Math.max(rowsCount, 1)
  }
  return Number(option)
}

interface EventsTableProps {
  data: SummaryEventRow[]
  enableCsvExport?: boolean
}

export function EventsTable({
  data,
  enableCsvExport = false,
}: EventsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>('25')

  const table = useReactTable({
    data,
    columns: eventsColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: 'type', desc: false }],
      pagination: {
        pageIndex: 0,
        pageSize: toPageSize(pageSizeOption, data.length),
      },
    },
    getRowId: (row) => `${row.type}-${row.direction ?? ''}`,
  })

  useEffect(() => {
    if (pageSizeOption === 'all') {
      table.setPageSize(toPageSize('all', data.length))
      table.setPageIndex(0)
    }
  }, [pageSizeOption, data.length, table])

  const pageCount = Math.max(table.getPageCount(), 1)
  const pageIndex = table.getState().pagination.pageIndex

  return (
    <>
      <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page</span>
          <Select
            value={pageSizeOption}
            onValueChange={(value) => {
              const next = value as PageSizeOption
              setPageSizeOption(next)
              table.setPageSize(toPageSize(next, data.length))
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger size="sm" className="w-[90px]">
              <SelectValue placeholder="25" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {enableCsvExport ? (
          <ExportTableCsvButton
            table={table}
            getFilename={() => `interop-events-${new Date().toISOString()}.csv`}
          />
        ) : null}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={eventsColumns.length}
                className="h-20 text-center text-muted-foreground"
              >
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-muted-foreground text-sm">
          Page {pageIndex + 1} of {pageCount}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
