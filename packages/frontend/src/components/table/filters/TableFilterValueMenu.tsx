import partition from 'lodash/partition'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import { withViewTransition } from '~/utils/viewTransition'
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
  // Clicked, a value slides to its place in the other group; picked from
  // the keyboard it just moves.
  const toggle = (type: 'add' | 'remove', value: string) => {
    const update = () => dispatch({ type, payload: { id: filterId, value } })
    if (window.event?.type === 'click') {
      withViewTransition('values', nameValues, update)
    } else {
      update()
    }
  }

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
                data-filter-value={value}
                onSelect={(value) => toggle('remove', value)}
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
                data-filter-value={value}
                onSelect={(value) => toggle('add', value)}
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

/**
 * The values the menu's list shows in full: named, one scrolled half out
 * would be drawn whole, over the list's edge.
 */
function nameValues() {
  const named: HTMLElement[] = []
  for (const el of document.querySelectorAll<HTMLElement>(
    '[data-filter-value]',
  )) {
    const list = el.closest('[cmdk-list]')?.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    if (!list || box.top < list.top || box.bottom > list.bottom) continue
    el.style.viewTransitionName = `filter-value-${(el.dataset.filterValue ?? '').toLowerCase().replace(/[^\w-]/g, '-')}`
    el.style.setProperty('view-transition-class', 'filter-value')
    named.push(el)
  }
  return named
}
