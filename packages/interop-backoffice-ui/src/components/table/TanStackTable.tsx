import {
  flexRender,
  type Row,
  type RowData,
  type Table,
} from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import {
  Table as CoreTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { cn } from '~/utils/cn'
import { ExportTableCsvButton } from './ExportTableCsvButton'
import type { PageSizeOption } from './useTanStackTable'

interface TanStackTableProps<TData extends RowData> {
  table: Table<TData>
  pageSizeOption: PageSizeOption
  onPageSizeOptionChange: (value: PageSizeOption) => void
  emptyMessage: string
  enableCsvExport?: boolean
  getCsvFilename?: () => string
  rowClassName?: string | ((row: Row<TData>) => string | undefined)
  onRowClick?: (row: Row<TData>) => void
  getRowDataState?: (row: Row<TData>) => string | undefined
}

export function TanStackTable<TData extends RowData>({
  table,
  pageSizeOption,
  onPageSizeOptionChange,
  emptyMessage,
  enableCsvExport = false,
  getCsvFilename,
  rowClassName,
  onRowClick,
  getRowDataState,
}: TanStackTableProps<TData>) {
  const pageCount = Math.max(table.getPageCount(), 1)
  const pageIndex = table.getState().pagination.pageIndex

  return (
    <>
      <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page</span>
          <Select
            value={pageSizeOption}
            onValueChange={(value) =>
              onPageSizeOptionChange(value as PageSizeOption)
            }
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
          <ExportTableCsvButton table={table} getFilename={getCsvFilename} />
        ) : null}
      </div>

      <CoreTable>
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
                colSpan={Math.max(table.getVisibleLeafColumns().length, 1)}
                className="h-20 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={getRowDataState?.(row)}
                className={cn(
                  typeof rowClassName === 'function'
                    ? rowClassName(row)
                    : rowClassName,
                  onRowClick ? 'cursor-pointer' : undefined,
                )}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </CoreTable>

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
