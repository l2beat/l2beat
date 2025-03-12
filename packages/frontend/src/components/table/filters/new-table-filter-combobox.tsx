import { partition, uniq, uniqBy } from 'lodash'
import { useState } from 'react'
import {
  Command,
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
} from '~/components/core/popover'
import { useEventListener } from '~/hooks/use-event-listener'
import { FilterIcon } from '~/icons/filter'
import { NewTableFilterCheckbox } from './new-table-filter-checkbox'
import { useNewTableFilterContext } from './new-table-filter-context'
import type { FilterableValueId } from './new-types'
import { type FilterableValue, filterIdToLabel } from './new-types'

export function NewTableFilterCombobox<
  T extends { filterable: FilterableValue[] },
>({ entries }: { entries: T[] }) {
  const [open, setOpen] = useState(false)

  useEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault()
      setOpen((open) => !open)
    }
  })

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex gap-1.5">
          <FilterIcon />
          <span className="text-base font-semibold">Filters</span>
          <kbd className="flex size-4 items-center justify-center rounded bg-icon-secondary text-3xs text-primary-invert">
            F
          </kbd>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Content entries={entries} setOpen={setOpen} />
        </PopoverContent>
      </Popover>
    </>
  )
}

function Content<T extends { filterable: FilterableValue[] }>({
  entries,
  setOpen,
}: { entries: T[]; setOpen: (open: boolean) => void }) {
  const { state, dispatch } = useNewTableFilterContext()
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )
  const uniqFilterables = uniqBy(
    entries.flatMap((e) => e.filterable),
    'id',
  )

  if (!selectedId) {
    return (
      <Command className="border border-divider">
        <CommandInput className="h-9" placeholder="Search filters..." />
        <CommandList>
          <CommandEmpty>No filter found.</CommandEmpty>
          <CommandGroup>
            {uniqFilterables.map((filterable) => (
              <CommandItem
                className="font-semibold"
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

  const [selectedValues, notSelectedValues] = partition(
    uniq(
      entries.flatMap(
        (e) => e.filterable?.find((f) => f.id === selectedId)!.value,
      ),
    ),
    (value) =>
      state.some(
        (filter) => filter.id === selectedId && filter.values.includes(value),
      ),
  )
  return (
    <Command className="border border-divider">
      <CommandInput
        className="h-9"
        placeholder={`Search ${filterIdToLabel[selectedId].toLowerCase()}...`}
      />
      <CommandList>
        <CommandEmpty>No value found.</CommandEmpty>
        {selectedValues.length > 0 && (
          <CommandGroup>
            {selectedValues.map((value) => {
              return (
                <CommandItem
                  className="flex gap-2 font-semibold"
                  key={value}
                  value={value}
                  onSelect={(value) => {
                    setOpen(false)
                    dispatch({
                      type: 'remove',
                      payload: {
                        id: selectedId,
                        value,
                      },
                    })
                  }}
                >
                  <NewTableFilterCheckbox checked={true} />
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
                  className="flex gap-2 font-semibold"
                  key={value}
                  value={value}
                  onSelect={(value) => {
                    setOpen(false)
                    dispatch({
                      type: 'add',
                      payload: {
                        id: selectedId,
                        value,
                      },
                    })
                  }}
                >
                  <NewTableFilterCheckbox checked={false} />
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
