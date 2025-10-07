import { notUndefined } from '@l2beat/shared-pure'
import countBy from 'lodash/countBy'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { useMemo } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  popoverTriggerClasses,
} from '~/components/core/Popover'
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import { useIsMobile } from '~/hooks/useIsMobile'
import { useTracking } from '~/hooks/useTracking'
import { ChevronIcon } from '~/icons/Chevron'
import { FilterIcon } from '~/icons/Filter'
import { PlusIcon } from '~/icons/Plus'
import { cn } from '~/utils/cn'
import type { FilterableEntry } from './filterableValue'
import {
  emptyStateLabel,
  type FilterableValueId,
  filterIdToLabel,
  inputPlaceholder,
} from './filterableValue'
import { useTableFilterContext } from './TableFilterContext'
import {
  TableFilterInternalContextProvider,
  useTableFilterInternalContext,
} from './TableFilterInternalContext'
import { TableFilterValueMenuItems } from './TableFilterValueMenu'

export function TableFilterSelector({
  entries,
}: {
  entries: FilterableEntry[]
}) {
  const isMobile = useIsMobile()

  return (
    <TableFilterInternalContextProvider>
      {isMobile ? (
        <MobileFilters entries={entries} />
      ) : (
        <DesktopFilters entries={entries} />
      )}
    </TableFilterInternalContextProvider>
  )
}

function MobileFilters({ entries }: { entries: FilterableEntry[] }) {
  const { open, setOpen } = useTableFilterInternalContext()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(popoverTriggerClasses, 'h-8 gap-0')}
      >
        <Trigger />
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={'Filters'}
        description={'Select filters to apply'}
      >
        <Content entries={entries} />
      </CommandDialog>
    </>
  )
}

function DesktopFilters({ entries }: { entries: FilterableEntry[] }) {
  const { open, setOpen, onEscapeKeyDown } = useTableFilterInternalContext()

  useGlobalShortcut('f', () => {
    if (!open) {
      setOpen(true)
    }
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 gap-0">
        <Trigger />
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        side="bottom"
        onEscapeKeyDown={onEscapeKeyDown}
      >
        <Content entries={entries} />
      </PopoverContent>
    </Popover>
  )
}

function Trigger() {
  const { state } = useTableFilterContext()

  return (
    <>
      <FilterIcon />
      {Object.keys(state).length === 0 ? (
        <>
          <span className="ml-1.5 font-medium text-xs md:text-sm">Filters</span>
          <kbd className="ml-1.5 flex size-4 select-none items-center justify-center rounded bg-icon-secondary font-bold font-mono text-3xs text-primary-invert max-md:hidden">
            F
          </kbd>
        </>
      ) : (
        <PlusIcon className="ml-0.5 size-4" />
      )}
    </>
  )
}

function Content({ entries }: { entries: FilterableEntry[] }) {
  const { track } = useTracking()

  // Count unique values for each filter
  const counts = countBy(
    uniqBy(
      entries.flatMap((e) => e.filterable),
      (e) => `${e?.id}-${e?.value}`,
    ),
    (e) => e?.id,
  )

  // Get unique filterable ids that have more than one value
  const uniqFilterablesIds = uniqBy(
    entries.flatMap((e) => e.filterable),
    'id',
  )
    .filter((e) => e !== undefined)
    .filter((e) => {
      const count = counts[e.id]
      return count && count > 1
    })
    .map((f) => f.id)

  const valuesMap = useMemo(
    () =>
      new Map<FilterableValueId, string[]>(
        uniqFilterablesIds.map((id) => [
          id,
          uniq(
            entries.flatMap((e) =>
              e.filterable?.filter((f) => f.id === id).map((f) => f.value),
            ),
          ).filter(notUndefined),
        ]),
      ),
    [entries, uniqFilterablesIds],
  )

  const { state, dispatch } = useTableFilterContext()

  const { selectedId, setSelectedId, search, setSearch } =
    useTableFilterInternalContext()

  return (
    <Command>
      <CommandInput
        placeholder={inputPlaceholder(selectedId)}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{emptyStateLabel(selectedId)}</CommandEmpty>
        {selectedId ? (
          <TableFilterValueMenuItems
            filterId={selectedId}
            values={valuesMap.get(selectedId) ?? []}
          />
        ) : (
          <CommandGroup>
            {uniqFilterablesIds.map((id) => (
              <CommandItem
                className="font-medium"
                key={id}
                value={id}
                onSelect={() => {
                  setSelectedId(id)
                  setSearch('')
                  track('filterIdSelected', {
                    props: { name: id },
                  })
                }}
              >
                {filterIdToLabel[id]}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {!selectedId && search.length !== 0 && (
          <CommandGroup>
            {Array.from(valuesMap.entries()).map(([id, values]) => {
              return values.map((value) => (
                <CommandItem
                  className="font-medium"
                  key={`${id}-${value}`}
                  value={`${id}-${value}`}
                  onSelect={() => {
                    const isSelected = state[id]?.values.includes(value)

                    if (isSelected) {
                      dispatch({
                        type: 'remove',
                        payload: {
                          id,
                          value,
                        },
                      })
                    } else {
                      dispatch({
                        type: 'add',
                        payload: {
                          id,
                          value,
                        },
                      })
                    }
                    setSearch('')
                  }}
                >
                  <span className="text-secondary">{filterIdToLabel[id]}</span>
                  <ChevronIcon className="-rotate-90 mx-1 size-2 fill-secondary" />
                  <span>{value}</span>
                </CommandItem>
              ))
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
