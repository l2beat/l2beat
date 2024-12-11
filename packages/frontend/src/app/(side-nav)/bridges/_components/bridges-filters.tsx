import { uniq } from 'lodash'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { TableFilter } from '~/components/table/filters/table-filter'
import {
  type BridgesFilterEntry,
  useBridgesFilterValues,
} from './bridges-filter-context'

interface Props {
  entries: BridgesFilterEntry[]
}

export function BridgesFilters({ entries }: Props) {
  const filter = useBridgesFilterValues()

  const typeOptions = uniq(entries.map((entry) => entry.category)).sort()

  const validatedByOptions = uniq(
    entries.map((entry) => entry.validatedBy?.value),
  ).sort()

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
