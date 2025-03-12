import { partition } from 'lodash'
import { useState } from 'react'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/popover'
import { VerticalSeparator } from '~/components/core/vertical-separator'
import { CloseIcon } from '~/icons/close'
import { NewTableFilterCheckbox } from './new-table-filter-checkbox'
import { useNewTableFilterContext } from './new-table-filter-context'
import { filterIdToLabel } from './new-types'
import type { FilterState } from './use-filter-state'

export function NewTableFilterItem({
  filter,
  possibleValues,
}: { filter: FilterState[number]; possibleValues: string[] }) {
  const [conditionOpen, setConditionOpen] = useState(false)
  const { state, dispatch } = useNewTableFilterContext()

  const [selectedValues, notSelectedValues] = partition(
    possibleValues,
    (value) =>
      state.some((f) => f.id === filter.id && f.values.includes(value)),
  )
  return (
    <div className="flex h-8 items-center rounded-lg bg-surface-primary text-base font-semibold leading-none">
      <div className="flex h-full items-center justify-center pl-2.5 pr-2">
        {filterIdToLabel[filter.id]}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <Popover open={conditionOpen} onOpenChange={setConditionOpen}>
        <PopoverTrigger className="flex h-full items-center justify-center px-2 font-semibold">
          {conditionLabel(filter)}
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setConditionOpen(false)
                    dispatch({
                      type: 'setReversed',
                      payload: { id: filter.id, value: false },
                    })
                  }}
                >
                  {filter.values.length > 1 ? 'is any of' : 'is'}
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setConditionOpen(false)
                    dispatch({
                      type: 'setReversed',
                      payload: { id: filter.id, value: true },
                    })
                  }}
                >
                  is not
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <VerticalSeparator className="h-[30px]" />
      <Popover>
        <PopoverTrigger className="flex h-full items-center justify-center px-2 font-semibold">
          {filter.values.join(', ')}
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0">
          <Command>
            <CommandList>
              {selectedValues.length > 0 && (
                <CommandGroup>
                  {selectedValues.map((value) => {
                    return (
                      <CommandItem
                        key={value}
                        className="flex gap-2"
                        onSelect={() => {
                          dispatch({
                            type: 'remove',
                            payload: {
                              id: filter.id,
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
                        key={value}
                        className="flex gap-2"
                        onSelect={() => {
                          dispatch({
                            type: 'add',
                            payload: {
                              id: filter.id,
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
        </PopoverContent>
      </Popover>
      <VerticalSeparator className="h-[30px]" />
      <button
        className="h-full pl-2 pr-2.5"
        onClick={() => dispatch({ type: 'remove', payload: { id: filter.id } })}
      >
        <div className="inline-flex size-3 items-center justify-center rounded-sm bg-brand">
          <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
        </div>
      </button>
    </div>
  )
}

function conditionLabel(filter: FilterState[number]) {
  if (filter.reversed) {
    return 'is not'
  }

  return filter.values.length > 1 ? 'is any of' : 'is'
}
