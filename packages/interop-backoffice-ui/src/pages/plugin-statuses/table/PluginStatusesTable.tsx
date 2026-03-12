import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from 'lucide-react'
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
import { pluginStatusesColumns } from './columns'
import { exportPluginStatusesToCsv } from './csv'
import type { PluginStatus } from './types'

type PageSizeOption = '10' | '25' | '50' | '100' | 'all'

function toPageSize(option: PageSizeOption, rowsCount: number) {
  if (option === 'all') {
    return Math.max(rowsCount, 1)
  }
  return Number(option)
}

interface PluginStatusesTableProps {
  data: PluginStatus[]
  enableCsvExport?: boolean
}

export function PluginStatusesTable({
  data,
  enableCsvExport = false,
}: PluginStatusesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>('25')

  const table = useReactTable({
    data,
    columns: pluginStatusesColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: toPageSize(pageSizeOption, data.length),
      },
    },
    getRowId: (row) => `${row.pluginName}-${row.chain}`,
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const sortedRows = table
                .getSortedRowModel()
                .rows.map((row) => row.original)
              exportPluginStatusesToCsv(sortedRows)
            }}
          >
            <DownloadIcon />
            Export CSV
          </Button>
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
                colSpan={pluginStatusesColumns.length}
                className="h-20 text-center text-muted-foreground"
              >
                No plugin statuses found.
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
