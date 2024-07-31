import { uniq } from 'lodash'
import React from 'react'
import { TableFilter } from '~/app/_components/table/filters/table-filter'
import {
  BaseScalingFilters,
  type BaseScalingFiltersEntry,
  type BaseScalingFiltersState,
} from './base-scaling-filters'
import { useScalingFilter } from './scaling-filter-context'

export type ScalingFiltersState = {
  hostChain: string | undefined
} & BaseScalingFiltersState

interface Props {
  items: BaseScalingFiltersEntry[]
}

export function ScalingFilters({ items }: Props) {
  const state = useScalingFilter()
  const hostChainOptions = uniq(
    items.map((item) =>
      item.type === 'layer3' && !('dataAvailability' in item)
        ? item.hostChainName
        : 'Ethereum',
    ),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const hostChainFilter = hostChainOptions.length > 1 && (
    <TableFilter
      title="Host Chain"
      options={hostChainOptions}
      value={state.hostChain}
      onValueChange={(value) => state.set({ hostChain: value })}
    />
  )

  return (
    <BaseScalingFilters items={items} additionalFilters={hostChainFilter} />
  )
}
