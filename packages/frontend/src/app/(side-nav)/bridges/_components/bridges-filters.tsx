import { uniq } from 'lodash'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { TableFilter } from '~/components/table/filters/table-filter'
import type { CommonBridgesEntry } from '~/server/features/bridges/get-common-bridges-entry'
import { useBridgesFilterValues } from './bridges-filter-context'

interface Props {
  entries: CommonBridgesEntry[]
}

export function BridgesFilters({ entries }: Props) {
  const filter = useBridgesFilterValues()

  const filterables = entries
    .map((e) => e.filterable)
    .filter((f) => f !== undefined)

  const typeOptions = uniq(filterables.map((f) => f.type)).sort()

  const validatedByOptions = uniq(filterables.map((f) => f.validatedBy)).sort()

  return (
    <OverflowWrapper>
      <div className="flex flex-row justify-between space-x-2">
        <div className="flex space-x-2">
          <TableFilter
            title="Validated by"
            options={validatedByOptions}
            value={filter.validatedBy}
            onValueChange={(validatedBy) => filter.set({ validatedBy })}
          />
          <TableFilter
            title="Type"
            options={typeOptions}
            value={filter.type}
            onValueChange={(type) => filter.set({ type })}
          />
        </div>
      </div>
    </OverflowWrapper>
  )
}
