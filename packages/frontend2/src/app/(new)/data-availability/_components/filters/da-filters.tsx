import { uniq } from 'lodash'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { TableFilter } from '~/app/_components/table/filters/table-filter'
import { type CommonDaEntry, useDaFilterValues } from './da-filter-context'

interface Props {
  items: CommonDaEntry[]
}

export function DaFilters({ items }: Props) {
  const filter = useDaFilterValues()

  const layerTypeOptions = uniq(items.map((item) => item.layerType))
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  return (
    <OverflowWrapper>
      <div className="flex flex-row space-x-2">
        <TableFilter
          title="Layer type"
          options={layerTypeOptions}
          value={filter.layerType}
          onValueChange={(value) => filter.set({ layerType: value })}
        />
      </div>
    </OverflowWrapper>
  )
}
