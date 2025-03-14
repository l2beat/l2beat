import { notUndefined } from '@l2beat/shared-pure'
import { partition, uniq, uniqBy } from 'lodash'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  popoverTriggerClasses,
} from '~/components/core/popover'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventListener } from '~/hooks/use-event-listener'
import { FilterIcon } from '~/icons/filter'
import { cn } from '~/utils/cn'
import { TableFilterCheckbox } from './table-filter-checkbox'
import { useTableFilterContext } from './table-filter-context'
import type { FilterableEntry, FilterableValueId } from './types'
import { filterIdToLabel } from './utils/filter-id-to-label'
import { filterValuesSortFn } from './utils/filter-values-sort-fn'

export function TableFilterCombobox({
  entries,
}: { entries: FilterableEntry[] }) {
  useTableFilterContext()
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  useEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault()
      setOpen((open) => !open)
    }
  })

  if (isMobile) {
    return <MobileFilters entries={entries} open={open} setOpen={setOpen} />
  }

  return (
    <>
      <DesktopFilters entries={entries} open={open} setOpen={setOpen} />
    </>
  )
}

function MobileFilters({
  entries,
  open,
  setOpen,
}: {
  entries: FilterableEntry[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { state } = useTableFilterContext()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(popoverTriggerClasses, 'h-8')}
      >
        <FilterIcon />
        {state.length === 0 && (
          <span className="text-base font-medium">Filters</span>
        )}
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={'Filters'}
        description={'Select filters to apply'}
      >
        <Content entries={entries} onValueSelect={() => setOpen(false)} />
      </CommandDialog>
    </>
  )
}

function DesktopFilters({
  entries,
  open,
  setOpen,
}: {
  entries: FilterableEntry[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { state } = useTableFilterContext()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 gap-1.5">
        <FilterIcon />
        {state.length === 0 && (
          <>
            <span className="text-base font-medium">Filters</span>
            <kbd className="flex size-4 items-center justify-center rounded bg-icon-secondary text-3xs text-primary-invert">
              F
            </kbd>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="bottom">
        <Content entries={entries} />
      </PopoverContent>
    </Popover>
  )
}

function Content({
  entries,
  onValueSelect,
}: {
  entries: FilterableEntry[]
  onValueSelect?: (value: string) => void
}) {
  const { state, dispatch } = useTableFilterContext()
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )
  const uniqFilterables = uniqBy(
    entries.flatMap((e) => e.filterable),
    'id',
  ).filter(notUndefined)

  if (!selectedId) {
    return (
      <Command className="border border-divider">
        <CommandInput className="h-9" placeholder="Search filters..." />
        <CommandList>
          <CommandEmpty>No filter found.</CommandEmpty>
          <CommandGroup>
            {uniqFilterables.map((filterable) => (
              <CommandItem
                className="font-medium"
                key={filterable.id}
                value={filterable.id}
                onSelect={() => {
                  setSelectedId(filterable.id)
                }}
              >
                {filterIdToLabel[filterable.id]}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }

  const values = uniq(
    entries.flatMap(
      (e) => e.filterable?.find((f) => f.id === selectedId)!.value,
    ),
  )
    .filter(notUndefined)
    .sort(filterValuesSortFn)

  const [selectedValues, notSelectedValues] = partition(values, (value) =>
    state.some(
      (filter) => filter.id === selectedId && filter.values.includes(value),
    ),
  )
  return (
    <Command className="border border-divider">
      <CommandInput className="h-9" placeholder={filterIdToLabel[selectedId]} />
      <CommandList>
        <CommandEmpty>No value found.</CommandEmpty>
        {selectedValues.length > 0 && (
          <CommandGroup>
            {selectedValues.map((value) => {
              return (
                <CommandItem
                  className="flex gap-2 font-medium"
                  key={value}
                  value={value}
                  onSelect={(value) => {
                    onValueSelect?.(value)
                    dispatch({
                      type: 'remove',
                      payload: {
                        id: selectedId,
                        value,
                      },
                    })
                  }}
                >
                  <TableFilterCheckbox checked={true} />
                  {value}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
        {notSelectedValues.length > 0 && (
          <CommandGroup>
            {notSelectedValues.map((value) => {
              return (
                <CommandItem
                  className="flex gap-2 font-medium"
                  key={value}
                  value={value}
                  onSelect={(value) => {
                    onValueSelect?.(value)
                    dispatch({
                      type: 'add',
                      payload: {
                        id: selectedId,
                        value,
                      },
                    })
                  }}
                >
                  <TableFilterCheckbox checked={false} />
                  {value}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
