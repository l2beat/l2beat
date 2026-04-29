import type { Column, RowData } from '@tanstack/react-table'
import { CheckIcon, SearchIcon, XIcon } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Button } from '~/components/core/Button'
import { Input } from '~/components/core/Input'
import { cn } from '~/utils/cn'

interface ColumnFilterPopoverProps<TData extends RowData> {
  column: Column<TData>
  onClose?: () => void
}

export function ColumnFilterPopover<TData extends RowData>({
  column,
  onClose,
}: ColumnFilterPopoverProps<TData>) {
  const filterMeta = column.columnDef.meta?.filter
  const [search, setSearch] = useState('')

  const facetedValues = column.getFacetedUniqueValues()
  const filterValue = column.getFilterValue()
  const selected = useMemo(
    () =>
      new Set<unknown>(
        Array.isArray(filterValue) ? (filterValue as unknown[]) : [],
      ),
    [filterValue],
  )

  // Snapshot the initial selection so toggling doesn't re-sort the list and
  // shift the row out from under the user's cursor.
  const initialSelectedRef = useRef(selected)
  const options = useMemo(() => {
    const initialSelected = initialSelectedRef.current
    const list = Array.from(facetedValues.entries()).map(([value, count]) => ({
      value,
      count,
    }))
    list.sort((a, b) => {
      const aSelected = initialSelected.has(a.value) ? 1 : 0
      const bSelected = initialSelected.has(b.value) ? 1 : 0
      if (aSelected !== bSelected) return bSelected - aSelected
      return String(a.value).localeCompare(String(b.value))
    })
    return list
  }, [facetedValues])

  const renderLabel = (value: unknown) => {
    if (filterMeta?.kind === 'select' && filterMeta.getOptionLabel) {
      return filterMeta.getOptionLabel(value)
    }
    return String(value ?? '')
  }

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return options
    return options.filter((option) =>
      String(option.value).toLowerCase().includes(query),
    )
  }, [options, search])

  const toggle = (value: unknown) => {
    const next = new Set(selected)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    column.setFilterValue(next.size === 0 ? undefined : Array.from(next))
  }

  const clearAll = () => {
    column.setFilterValue(undefined)
  }

  return (
    <div className="flex flex-col">
      <div className="border-b p-2">
        <div className="relative">
          <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search values"
            className="h-8 pl-7 text-xs"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-auto py-1">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-4 text-center text-muted-foreground text-xs">
            No values
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selected.has(option.value)
            return (
              <button
                type="button"
                key={String(option.value)}
                onClick={() => toggle(option.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-accent',
                  isSelected && 'bg-accent/40',
                )}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-[4px] border',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input',
                    )}
                  >
                    {isSelected ? <CheckIcon className="size-3" /> : null}
                  </span>
                  <span className="min-w-0 truncate">
                    {renderLabel(option.value)}
                  </span>
                </span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {option.count}
                </span>
              </button>
            )
          })
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          disabled={selected.size === 0}
        >
          <XIcon />
          Clear
        </Button>
        {onClose ? (
          <Button variant="default" size="sm" onClick={onClose}>
            Done
          </Button>
        ) : null}
      </div>
    </div>
  )
}
