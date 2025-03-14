import partition from 'lodash/partition'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import { TableFilterCheckbox } from './table-filter-checkbox'
import { useTableFilterContext } from './table-filter-context'
import type { FilterableValueId } from './types'
import { filterIdToLabel } from './utils/filter-id-to-label'
import { filterValuesSortFn } from './utils/filter-values-sort-fn'

interface Props {
  filterId: FilterableValueId
  values: string[]
  onSelect?: (value: string) => void
}

export function TableFilterValueMenu({ filterId, values, onSelect }: Props) {
  const { state, dispatch } = useTableFilterContext()

  const sortedValues = values.sort(filterValuesSortFn)
  const [selectedValues, notSelectedValues] = partition(sortedValues, (value) =>
    state.some(
      (filter) => filter.id === filterId && filter.values.includes(value),
    ),
  )
  return (
    <Command className="border border-divider">
      <CommandInput className="h-9" placeholder={filterIdToLabel[filterId]} />
      <CommandList>
        <CommandEmpty>
          No {filterIdToLabel[filterId].toLowerCase()} found.
        </CommandEmpty>
        {selectedValues.length > 0 && (
          <CommandGroup>
            {selectedValues.map((value) => {
              return (
                <CommandItem
                  className="flex gap-2 font-medium"
                  key={value}
                  value={value}
                  onSelect={(value) => {
                    onSelect?.(value)
                    dispatch({
                      type: 'remove',
                      payload: {
                        id: filterId,
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
                    onSelect?.(value)
                    dispatch({
                      type: 'add',
                      payload: {
                        id: filterId,
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
