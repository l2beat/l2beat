import { uniq } from 'lodash'
import { cn } from '~/utils/cn'
import { NewTableFilterClearButton } from './new-table-filter-clear-button'
import { NewTableFilterCombobox } from './new-table-filter-combobox'
import { useNewTableFilterContext } from './new-table-filter-context'
import { NewTableFilterItem } from './new-table-filter-item'
import type { FilterableEntry } from './new-types'

type Props = {
  entries: FilterableEntry[]
  className?: string
}

export function NewTableFilters({ entries, className }: Props) {
  const { state } = useNewTableFilterContext()

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 max-md:mt-4 max-md:px-4',
        className,
      )}
    >
      <NewTableFilterCombobox entries={entries} />
      {state.map((filter) => (
        <NewTableFilterItem
          key={filter.id}
          filter={filter}
          possibleValues={uniq(
            entries.flatMap((e) =>
              (e.filterable ?? [])
                ?.filter((f) => f.id === filter.id)
                .map((f) => f.value),
            ),
          )}
        />
      ))}
      {state.length > 0 && <NewTableFilterClearButton />}
    </div>
  )
}
