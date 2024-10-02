'use client'

import { uniq } from 'lodash'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { BaseScalingFilters } from './base-scaling-filters'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: CommonScalingEntry[]
  showRollupsOnly?: boolean
}

export function ScalingFilters({ items, showRollupsOnly }: Props) {
  const state = useScalingFilterValues()
  const hostChainOptions = uniq(
    items.map((item) => item.hostChain ?? 'Ethereum'),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const hostChainFilter = (
    <TableFilter
      title="Host Chain"
      options={hostChainOptions}
      value={state.hostChain}
      onValueChange={(value) => state.set({ hostChain: value })}
    />
  )

  return (
    <BaseScalingFilters
      items={items}
      additionalFilters={hostChainFilter}
      showRollupsOnly={showRollupsOnly}
    />
  )
}
