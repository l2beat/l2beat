import { uniq } from 'lodash'
import { cn } from '~/utils/cn'
import { TableFilter } from './table-filter'
import { useTableFilterContext } from './table-filter-context'
import { TableFilterSelector } from './table-filter-selector'
import type { FilterableEntry } from './types'

type Props = {
  entries: FilterableEntry[]
  className?: string
}

export function TableFilters({ entries, className }: Props) {
  const { state } = useTableFilterContext()

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 max-md:mt-4 max-md:px-4',
        className,
      )}
    >
      <TableFilterSelector entries={entries} />
      {state.map((filter) => (
        <TableFilter
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
    </div>
  )
}
