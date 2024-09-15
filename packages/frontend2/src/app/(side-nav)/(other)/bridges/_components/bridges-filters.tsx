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

  const typeOptions = uniq(entries.map((entry) => entry.category))
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const validatedByOptions = uniq(
    entries.map((entry) => entry.validatedBy?.value),
  )
    .sort()
    .flatMap((value) =>
      value
        ? {
            label: value,
            value,
          }
        : [],
    )

  return (
    <OverflowWrapper>
      <div className="flex flex-row justify-between space-x-2">
        <div className="flex space-x-2">
          <TableFilter
            title="Validated by"
            options={validatedByOptions}
            value={filter.validatedBy}
            onValueChange={(value) => filter.set({ validatedBy: value })}
          />
          <TableFilter
            title="Type"
            options={typeOptions}
            value={filter.type}
            onValueChange={(value) => filter.set({ type: value })}
          />
        </div>
      </div>
    </OverflowWrapper>
  )
}
