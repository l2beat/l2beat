import { TableFilter } from '~/components/table/filters/table-filter'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { useScalingFilterValues } from './scaling-filter-context'
import { ScalingFilters } from './scaling-filters'

interface Props {
  items: ScalingActivityEntry[]
  className?: string
}
export function ScalingActivityFilters({ items, className }: Props) {
  const state = useScalingFilterValues()
  const daLayerOptions = getDaLayerOptions(items)

  const daLayerFilter = (
    <TableFilter
      key="activity-da-layer"
      title="DA Layer"
      options={daLayerOptions}
      value={state.daLayer}
      onValueChange={(value) => state.set({ daLayer: value })}
    />
  )

  return (
    <ScalingFilters
      items={items}
      additionalFilters={daLayerFilter}
      className={className}
    />
  )
}

function getDaLayerOptions(items: ScalingActivityEntry[]) {
  const daLayerOptions = items.reduce(
    (acc, item) => {
      const val = item.dataAvailability?.layer?.value
      if (!val) {
        return acc
      }
      const obj = acc[val] ?? 0
      acc[val] = obj + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(daLayerOptions)
    .filter(([_, count]) => count >= 2)
    .map(([value]) => ({
      label: value,
      value,
    }))
}
