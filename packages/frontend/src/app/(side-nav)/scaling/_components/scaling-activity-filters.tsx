import { notUndefined } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { getDaLayerValue } from '../data-availability/_components/scaling-da-filters'
import { useScalingFilterValues } from './scaling-filter-context'
import { ScalingFilters } from './scaling-filters'

interface Props {
  items: ScalingActivityEntry[]
  className?: string
}
export function ScalingActivityFilters({ items, className }: Props) {
  const state = useScalingFilterValues()
  const daLayerOptions = uniq(
    items
      .map((item) =>
        item.dataAvailability.layer
          ? getDaLayerValue(item.dataAvailability.layer)
          : undefined,
      )
      .filter(notUndefined),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

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
