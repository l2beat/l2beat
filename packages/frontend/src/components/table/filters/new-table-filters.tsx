import { NewTableFilterClearButton } from './new-table-filter-clear-button'
import { NewTableFilterCombobox } from './new-table-filter-combobox'
import { useNewTableFilterContext } from './new-table-filter-context'
import type { FilterableValue } from './new-types'

type Props<T extends { filterable: FilterableValue[] }> = {
  entries: T[]
}

export function NewTableFilters<T extends { filterable: FilterableValue[] }>({
  entries,
}: Props<T>) {
  const { state } = useNewTableFilterContext()

  return (
    <div className="flex justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {state.map((filter) => (
          <div key={filter.id}>
            <span>{filter.id}</span>
            <span>{filter.values.join(', ')}</span>
          </div>
        ))}
        <NewTableFilterCombobox entries={entries} />
      </div>
      {state.length > 0 && <NewTableFilterClearButton />}
    </div>
  )
}
