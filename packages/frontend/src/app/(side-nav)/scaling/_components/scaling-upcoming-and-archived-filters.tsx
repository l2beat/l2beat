import { uniq } from 'lodash'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type ScalingArchivedEntry } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { type ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: ScalingUpcomingEntry[] | ScalingArchivedEntry[]
  className?: string
}

export function ScalingUpcomingAndArchivedFilters({ items, className }: Props) {
  const filter = useScalingFilterValues()
  const typeOptions = uniq(items.map((item) => item.category))
    .sort()
    .filter((value) => !!value)
  const stackOptions = uniq(items.map((item) => item.provider))
    .sort()
    .map((value) => value ?? 'No stack')
  const purposeOptions = uniq(items.flatMap((item) => item.purposes)).sort()

  return (
    <OverflowWrapper className={className}>
      <div className="flex flex-row space-x-2">
        <TableFilter
          title="Type"
          options={typeOptions}
          value={filter.type}
          onValueChange={(type) => filter.set({ type })}
        />
        <TableFilter
          title="Stack"
          options={stackOptions}
          value={filter.stack}
          onValueChange={(stack) => filter.set({ stack })}
        />
        <TableFilter
          title="Purpose"
          options={purposeOptions}
          value={filter.purpose}
          onValueChange={(purpose) => filter.set({ purpose })}
        />
      </div>
    </OverflowWrapper>
  )
}
