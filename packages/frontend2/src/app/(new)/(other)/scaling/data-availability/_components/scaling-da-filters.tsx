import { uniq } from 'lodash'
import React from 'react'
import { TableFilter } from '~/app/_components/table/filters/table-filter'
import { type ScalingDataAvailabilityEntry } from '~/server/features/scaling/types'
import {
  BaseScalingFilters,
  type BaseScalingFiltersState,
} from '../../../_components/base-scaling-filters'

type ScalingFiltersEntry = ScalingDataAvailabilityEntry
export type ScalingDaFiltersState = {
  daLayer: string | undefined
} & BaseScalingFiltersState

interface Props {
  items: ScalingFiltersEntry[]
  state: ScalingDaFiltersState
  setState: React.Dispatch<React.SetStateAction<ScalingDaFiltersState>>
}

export function ScalingDaFilters({ items, state, setState }: Props) {
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
      value={state.daLayer}
      onValueChange={(value) =>
        setState((prev) => ({ ...prev, daLayer: value }))
      }
    />
  )

  return (
    <BaseScalingFilters
      setState={setState}
      state={state}
      items={items}
      additionalFilters={daLayerFilter}
    />
  )
}
