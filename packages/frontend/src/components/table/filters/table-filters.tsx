import { uniq } from 'lodash'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { cn } from '~/utils/cn'
import { TableFilter } from './table-filter'
import { TableFilterClearButton } from './table-filter-clear-button'
import { TableFilterCombobox } from './table-filter-combobox'
import { useTableFilterContext } from './table-filter-context'
import type { FilterableEntry } from './types'

type Props = {
  entries: FilterableEntry[]
  className?: string
}

export function TableFilters({ entries, className }: Props) {
  const { state } = useTableFilterContext()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div
        className={cn('flex flex-col gap-2 max-md:mt-4 max-md:px-4', className)}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <TableFilterCombobox entries={entries} />
          {state.length > 0 && <TableFilterClearButton />}
        </div>
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
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 max-md:mt-4 max-md:px-4',
        className,
      )}
    >
      <TableFilterCombobox entries={entries} />
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
      {state.length > 0 && <TableFilterClearButton />}
    </div>
  )
}
