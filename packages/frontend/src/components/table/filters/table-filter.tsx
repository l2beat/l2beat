import { partition } from 'lodash'
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
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/popover'
import { VerticalSeparator } from '~/components/core/vertical-separator'
import { CloseIcon } from '~/icons/close'
import { TableFilterCheckbox } from './table-filter-checkbox'
import { useTableFilterContext } from './table-filter-context'
import type { FilterState } from './use-filter-state'
import { filterIdToLabel } from './utils/filter-id-to-label'
import { filterValuesSortFn } from './utils/filter-values-sort-fn'

export function TableFilter({
  filter,
  possibleValues,
}: { filter: FilterState[number]; possibleValues: string[] }) {
  const { state, dispatch } = useTableFilterContext()

  const [selectedValues, notSelectedValues] = partition(
    possibleValues.sort(filterValuesSortFn),
    (value) =>
      state.some((f) => f.id === filter.id && f.values.includes(value)),
  )
  return (
    <div className="flex h-8 select-none items-center rounded-lg bg-surface-primary text-base font-medium leading-none primary-card:bg-surface-secondary">
      <div className="flex h-full items-center justify-center pl-2.5 pr-2">
        {filterIdToLabel[filter.id]}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <button
        className="flex h-full items-center justify-center rounded-none px-2 font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
        onClick={() => {
          dispatch({
            type: 'setReversed',
            payload: { id: filter.id, value: !filter.reversed },
          })
        }}
      >
        {operatorLabel(filter)}
      </button>
      <VerticalSeparator className="h-[30px]" />
      <Popover>
        <PopoverAnchor className="h-full" />
        <PopoverTrigger className="flex h-full items-center justify-center rounded-none px-2 font-medium">
          {filter.values.length > 1
            ? `${filter.values.length} values`
            : filter.values[0]}
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0" side="bottom">
          <Command>
            <CommandInput placeholder={filterIdToLabel[filter.id]} />
            <CommandEmpty>
              No {filterIdToLabel[filter.id].toLowerCase()} found.
            </CommandEmpty>
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
                        <TableFilterCheckbox checked={false} />
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
        className="h-full rounded-r-lg pl-2 pr-2.5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
        onClick={() => dispatch({ type: 'remove', payload: { id: filter.id } })}
      >
        <div className="inline-flex size-3 items-center justify-center rounded-sm bg-brand">
          <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
        </div>
      </button>
    </div>
  )
}

function operatorLabel(filter: FilterState[number]) {
  if (filter.reversed) {
    return 'is not'
  }

  return filter.values.length > 1 ? 'is any of' : 'is'
}
