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
    <div>
      <NewTableFilterCombobox entries={entries} />

      {state.map((filter) => (
        <div key={filter.id}>
          <span>{filter.id}</span>
          <span>{filter.values.join(', ')}</span>
        </div>
      ))}
    </div>
  )
}
