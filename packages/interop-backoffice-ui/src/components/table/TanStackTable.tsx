import {
  flexRender,
  type Row,
  type RowData,
  type Table,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderCircleIcon,
  SearchIcon,
} from 'lucide-react'
import { type UIEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '~/components/core/Button'
import { Input } from '~/components/core/Input'
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
import { SortableHeader } from './SortableHeader'
import type { PageSizeOption } from './useTanStackTable'

interface TanStackTableProps<TData extends RowData> {
  table: Table<TData>
  pageSizeOption: PageSizeOption
  onPageSizeOptionChange: (value: PageSizeOption) => void
  emptyMessage: string
  enableVirtualization?: boolean
  enableCsvExport?: boolean
  getCsvFilename?: () => string
  rowClassName?: string | ((row: Row<TData>) => string | undefined)
  onRowClick?: (row: Row<TData>) => void
  getRowDataState?: (row: Row<TData>) => string | undefined
  totalRowsCount?: number
  filteredRowsCount?: number
  searchValue?: string
  onSearchValueChange?: (value: string) => void
  searchPlaceholder?: string
  isSearchPending?: boolean
}

export function TanStackTable<TData extends RowData>({
  table,
  pageSizeOption,
  onPageSizeOptionChange,
  emptyMessage,
  enableVirtualization = true,
  enableCsvExport = false,
  getCsvFilename,
  rowClassName,
  onRowClick,
  getRowDataState,
  totalRowsCount,
  filteredRowsCount,
  searchValue,
  onSearchValueChange,
  searchPlaceholder = 'Search',
  isSearchPending = false,
}: TanStackTableProps<TData>) {
  const pageCount = Math.max(table.getPageCount(), 1)
  const pageIndex = table.getState().pagination.pageIndex
  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const headerHeightPx = headerGroups.length * 40
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({
    showHeaderShadow: false,
    scrollWidth: 0,
  })
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 41,
    getItemKey: (index) => rows[index]?.id ?? index,
    getScrollElement: () => scrollViewportRef.current,
    overscan: 10,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const firstVirtualRow = virtualRows[0]
  const lastVirtualRow = virtualRows[virtualRows.length - 1]
  const virtualPaddingTop = firstVirtualRow ? firstVirtualRow.start : 0
  const virtualPaddingBottom = lastVirtualRow
    ? rowVirtualizer.getTotalSize() - lastVirtualRow.end
    : 0
  const visibleColumnsCount = Math.max(table.getVisibleLeafColumns().length, 1)

  const syncScrollState = useCallback((element: HTMLDivElement) => {
    const nextState = {
      showHeaderShadow: element.scrollTop > 0,
      scrollWidth: element.scrollWidth,
    }

    setScrollState((current) =>
      current.showHeaderShadow === nextState.showHeaderShadow &&
      current.scrollWidth === nextState.scrollWidth
        ? current
        : nextState,
    )
  }, [])

  const handleTableScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      syncScrollState(event.currentTarget)
    },
    [syncScrollState],
  )

  useEffect(() => {
    const element = scrollViewportRef.current
    if (!element) return

    syncScrollState(element)

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      syncScrollState(element)
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [syncScrollState])

  return (
    <>
      <div className="flex flex-col gap-3 border-b px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {onSearchValueChange ? (
            <div className="relative w-full sm:max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                {isSearchPending ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  <SearchIcon className="size-4" />
                )}
              </div>
              <Input
                value={searchValue}
                onChange={(event) => onSearchValueChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          ) : null}

          {typeof totalRowsCount === 'number' ? (
            <span className="text-muted-foreground text-sm">
              {searchValue?.trim()
                ? `${filteredRowsCount ?? totalRowsCount} matching rows`
                : `${totalRowsCount} rows`}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
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
      </div>

      <div
        className="relative max-h-[80vh] w-full overflow-auto"
        ref={scrollViewportRef}
        onScroll={handleTableScroll}
      >
        {scrollState.showHeaderShadow ? (
          <div
            className="-mt-px pointer-events-none sticky z-[25] h-3 bg-gradient-to-b from-slate-900/20 to-transparent"
            style={{
              top: `${headerHeightPx}px`,
              width:
                scrollState.scrollWidth > 0
                  ? `${scrollState.scrollWidth}px`
                  : '100%',
            }}
          />
        ) : null}

        <CoreTable containerClassName="overflow-visible">
          <TableHeader className="[&_tr]:bg-background">
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky bg-background"
                    style={{
                      top: `${headerGroup.depth * 40}px`,
                      zIndex: 30 - headerGroup.depth,
                    }}
                  >
                    <SortableHeader header={header} />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsCount}
                  className="h-20 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {enableVirtualization && virtualPaddingTop > 0 ? (
                  <TableRow
                    aria-hidden="true"
                    className="border-0 hover:bg-transparent"
                  >
                    <TableCell
                      colSpan={visibleColumnsCount}
                      className="h-0 border-0 p-0 first:pl-0 last:pr-0"
                      style={{ height: `${virtualPaddingTop}px` }}
                    />
                  </TableRow>
                ) : null}

                {enableVirtualization
                  ? virtualRows.map((virtualRow) => {
                      const row = rows[virtualRow.index]

                      if (!row) {
                        return null
                      }

                      return (
                        <TableRow
                          key={row.id}
                          data-index={virtualRow.index}
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
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })
                  : rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        data-index={index}
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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                {enableVirtualization && virtualPaddingBottom > 0 ? (
                  <TableRow
                    aria-hidden="true"
                    className="border-0 hover:bg-transparent"
                  >
                    <TableCell
                      colSpan={visibleColumnsCount}
                      className="h-0 border-0 p-0 first:pl-0 last:pr-0"
                      style={{ height: `${virtualPaddingBottom}px` }}
                    />
                  </TableRow>
                ) : null}
              </>
            )}
          </TableBody>
        </CoreTable>
      </div>

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
