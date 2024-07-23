import { uniq } from 'lodash'
import React from 'react'
import { TableFilter } from '~/app/_components/table/filters/table-filter'
import {
  BaseScalingFilters,
  type BaseScalingFiltersEntry,
  type BaseScalingFiltersState,
} from './base-scaling-filters'

export type ScalingFiltersState = {
  hostChain: string | undefined
} & BaseScalingFiltersState

interface Props<T extends ScalingFiltersState> {
  items: BaseScalingFiltersEntry[]
  state: T
  setState: React.Dispatch<React.SetStateAction<T>>
}

export function ScalingFilters<T extends ScalingFiltersState>({
  items,
  state,
  setState,
}: Props<T>) {
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
      onValueChange={(value) =>
        setState((prev) => ({ ...prev, hostChain: value }))
      }
    />
  )

  return (
    <BaseScalingFilters
      items={items}
      state={state}
      setState={setState}
      additionalFilters={hostChainFilter}
    />
  )
}
