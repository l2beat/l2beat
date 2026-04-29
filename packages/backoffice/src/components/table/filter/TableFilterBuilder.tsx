import type { Column, RowData, Table } from '@tanstack/react-table'
import { ChevronLeftIcon, FilterIcon, PlusIcon, XIcon } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/core/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { ColumnFilterPopover } from './ColumnFilterPopover'

interface TableFilterBuilderProps<TData extends RowData> {
  table: Table<TData>
}

export function TableFilterBuilder<TData extends RowData>({
  table,
}: TableFilterBuilderProps<TData>) {
  const filterableColumns = useMemo(
    () =>
      table
        .getAllLeafColumns()
        .filter((column) => column.columnDef.meta?.filter !== undefined),
    [table],
  )

  if (filterableColumns.length === 0) {
    return null
  }

  const activeColumns = filterableColumns.filter((column) =>
    column.getIsFiltered(),
  )
  const inactiveColumns = filterableColumns.filter(
    (column) => !column.getIsFiltered(),
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AddFilterButton
        inactiveColumns={inactiveColumns}
        hasActive={activeColumns.length > 0}
      />

      {activeColumns.map((column) => (
        <ActiveFilterChip key={column.id} column={column} />
      ))}

      {activeColumns.length > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          Clear all
        </Button>
      ) : null}
    </div>
  )
}

function AddFilterButton<TData extends RowData>({
  inactiveColumns,
  hasActive,
}: {
  inactiveColumns: Column<TData>[]
  hasActive: boolean
}) {
  const [open, setOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<Column<TData> | null>(
    null,
  )

  useEffect(() => {
    if (!open) setSelectedColumn(null)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {hasActive ? (
            <>
              <PlusIcon />
              Filter
            </>
          ) : (
            <>
              <FilterIcon />
              Add filter
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        {selectedColumn ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-1 border-b p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedColumn(null)}
              >
                <ChevronLeftIcon />
                Back
              </Button>
              <span className="truncate font-medium text-sm">
                {getColumnLabel(selectedColumn)}
              </span>
            </div>
            <ColumnFilterPopover
              column={selectedColumn}
              onClose={() => setOpen(false)}
            />
          </div>
        ) : inactiveColumns.length === 0 ? (
          <div className="px-2 py-3 text-center text-muted-foreground text-xs">
            All filters active
          </div>
        ) : (
          <div className="p-1">
            {inactiveColumns.map((column) => (
              <button
                type="button"
                key={column.id}
                onClick={() => setSelectedColumn(column)}
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span className="truncate">{getColumnLabel(column)}</span>
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function ActiveFilterChip<TData extends RowData>({
  column,
}: {
  column: Column<TData>
}) {
  const [open, setOpen] = useState(false)
  const filterMeta = column.columnDef.meta?.filter
  const value = column.getFilterValue()
  const values = Array.isArray(value) ? (value as unknown[]) : []
  const renderLabel = (raw: unknown) => {
    if (filterMeta?.kind === 'select' && filterMeta.getOptionLabel) {
      return filterMeta.getOptionLabel(raw)
    }
    return String(raw ?? '')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-stretch rounded-md border bg-background text-sm shadow-xs">
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-l-md py-1 pr-2 pl-2 hover:bg-accent"
          >
            <span className="text-muted-foreground">
              {getColumnLabel(column)}:
            </span>
            <span className="flex max-w-[280px] items-center gap-1 truncate">
              {values.length === 0 ? (
                <span className="text-muted-foreground">any</span>
              ) : values.length <= 2 ? (
                values.map((v, index) => (
                  <Fragment key={String(v)}>
                    {index > 0 ? (
                      <span className="text-muted-foreground">,</span>
                    ) : null}
                    <span className="truncate">{renderLabel(v)}</span>
                  </Fragment>
                ))
              ) : (
                <span>{values.length} selected</span>
              )}
            </span>
          </button>
        </PopoverTrigger>
        <button
          type="button"
          aria-label="Remove filter"
          className="flex items-center rounded-r-md border-l px-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={() => column.setFilterValue(undefined)}
        >
          <XIcon className="size-3.5" />
        </button>
      </div>
      <PopoverContent align="start" className="w-72 p-0">
        <ColumnFilterPopover column={column} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

function getColumnLabel<TData extends RowData>(column: Column<TData>): string {
  const filterLabel = column.columnDef.meta?.filter?.label
  if (filterLabel) return filterLabel
  const header = column.columnDef.header
  if (typeof header === 'string') return header
  return column.id
}
