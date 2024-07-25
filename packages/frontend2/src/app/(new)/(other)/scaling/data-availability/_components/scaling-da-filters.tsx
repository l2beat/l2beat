import { uniq } from 'lodash'
import React from 'react'
import { TableFilter } from '~/app/_components/table/filters/table-filter'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/types'
import {
  BaseScalingFilters,
  type BaseScalingFiltersState,
} from '../../../_components/base-scaling-filters'
import { useScalingFilter } from '../../../_components/scaling-filter-context'

type ScalingFiltersEntry = ScalingDataAvailabilityEntry
export type ScalingDaFiltersState = {
  daLayer: string | undefined
} & BaseScalingFiltersState

interface Props {
  items: ScalingFiltersEntry[]
}

export function ScalingDaFilters({ items }: Props) {
  const filter = useScalingFilter()
  const daLayerOptions = uniq(
    items.flatMap((item) => item.dataAvailability.layer.value),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const daLayerFilter = (
    <TableFilter
      title="DA Layer"
      options={daLayerOptions}
      value={filter.daLayer}
      onValueChange={(value) => filter.set({ daLayer: value })}
    />
  )

  return <BaseScalingFilters items={items} additionalFilters={daLayerFilter} />
}
