import { uniq, uniqBy } from 'lodash'
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
import { FilterIcon } from '~/icons/filter'
import { useNewTableFilterContext } from './new-table-filter-context'
import type { FilterableValue } from './new-types'

export function NewTableFilterCombobox<
  T extends { filterable: FilterableValue[] },
>({ entries }: { entries: T[] }) {
  const [open, setOpen] = useState(false)

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
  const { dispatch } = useNewTableFilterContext()
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
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
                key={filterable.id}
                value={filterable.id}
                onSelect={(id) => {
                  setSelectedId(id)
                }}
              >
                {filterable.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }
  const selectedFilterable = uniqFilterables.find((f) => f.id === selectedId)!

  const selectedFilterableValues = uniq(
    entries.flatMap(
      (e) => e.filterable?.find((f) => f.id === selectedId)?.value,
    ),
  )
  return (
    <Command className="border border-divider">
      <CommandInput className="h-9" placeholder="Search values..." />
      <CommandList>
        <CommandEmpty>No value found.</CommandEmpty>
        <CommandGroup>
          {selectedFilterableValues.map((value) => (
            <CommandItem
              key={value}
              value={value}
              onSelect={(value) => {
                setOpen(false)

                dispatch({
                  type: 'add',
                  payload: {
                    id: selectedId,
                    label: selectedFilterable.label,
                    value,
                  },
                })
              }}
            >
              {value}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
