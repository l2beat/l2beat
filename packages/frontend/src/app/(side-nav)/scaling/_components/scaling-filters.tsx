'use client'

import { uniq } from 'lodash'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { BaseScalingFilters } from './base-scaling-filters'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: CommonScalingEntry[]
  additionalFilters?: React.ReactNode
  showRollupsOnly?: boolean
  className?: string
}

export function ScalingFilters({
  items,
  additionalFilters,
  showRollupsOnly,
  className,
}: Props) {
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
      key="scaling-host-chain"
      title="Host Chain"
      options={hostChainOptions}
      value={state.hostChain}
      onValueChange={(value) => state.set({ hostChain: value })}
    />
  )

  return (
    <BaseScalingFilters
      items={items}
      additionalFilters={[hostChainFilter, additionalFilters]}
      showRollupsOnly={showRollupsOnly}
      className={className}
    />
  )
}
