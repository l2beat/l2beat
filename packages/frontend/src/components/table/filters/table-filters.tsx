import uniq from 'lodash/uniq'
import { cn } from '~/utils/cn'
import type { FilterableEntry, FilterableValueId } from './filterable-value'
import { TableFilter } from './table-filter'
import { useTableFilterContext } from './table-filter-context'
import { TableFilterSelector } from './table-filter-selector'

type Props = {
  entries: FilterableEntry[]
  className?: string
}

export function TableFilters({ entries, className }: Props) {
  const { state } = useTableFilterContext()

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 max-md:mt-4 max-md:px-4 primary-card:max-md:mt-0 primary-card:max-md:px-0',
        className,
      )}
    >
      <TableFilterSelector entries={entries} />
      {Object.entries(state).map(([id, filter]) => (
        <TableFilter
          key={id}
          filter={{ id: id as FilterableValueId, ...filter }}
          possibleValues={uniq(
            entries.flatMap((e) =>
              (e.filterable ?? [])
                ?.filter((f) => f.id === id)
                .map((f) => f.value),
            ),
          )}
        />
      ))}
    </div>
  )
}
