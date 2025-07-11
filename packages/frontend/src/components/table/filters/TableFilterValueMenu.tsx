import partition from 'lodash/partition'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import type { FilterableValueId } from './filterableValue'
import {
  emptyStateLabel,
  filterValuesSortFn,
  inputPlaceholder,
} from './filterableValue'
import { TableFilterCheckbox } from './TableFilterCheckbox'
import { useTableFilterContext } from './TableFilterContext'
import { useTableFilterInternalContext } from './TableFilterInternalContext'
import { TableFilterValue } from './TableFilterValue'

interface Props {
  filterId: FilterableValueId
  values: string[]
}

export function TableFilterValueMenu({ filterId, values }: Props) {
  const { search, setSearch } = useTableFilterInternalContext()
  return (
    <Command>
      <CommandInput
        className="h-9"
        placeholder={inputPlaceholder(filterId)}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{emptyStateLabel(filterId)}</CommandEmpty>
        <TableFilterValueMenuItems filterId={filterId} values={values} />
      </CommandList>
    </Command>
  )
}

export function TableFilterValueMenuItems({ filterId, values }: Props) {
  const { state, dispatch } = useTableFilterContext()

  const sortedValues = values.sort(filterValuesSortFn)
  const [selectedValues, notSelectedValues] = partition(sortedValues, (value) =>
    state[filterId]?.values.includes(value),
  )

  return (
    <>
      {selectedValues.length > 0 && (
        <CommandGroup>
          {selectedValues.map((value) => {
            return (
              <CommandItem
                className="flex gap-2 font-medium"
                key={value}
                value={value}
                onSelect={(value) => {
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
                <TableFilterValue values={[value]} filterId={filterId} />
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
                <TableFilterValue values={[value]} filterId={filterId} />
              </CommandItem>
            )
          })}
        </CommandGroup>
      )}
    </>
  )
}
