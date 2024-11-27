'use client'
import { notUndefined } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { Checkbox } from '~/components/core/checkbox'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { cn } from '~/utils/cn'
import { getDaLayerValue } from '../data-availability/_components/scaling-da-filters'
import { BaseScalingFilters } from './base-scaling-filters'
import { useScalingAssociatedTokensContext } from './scaling-associated-tokens-context'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: ScalingSummaryEntry[]
  className?: string
  showRollupsOnly?: boolean
}

export function ScalingSummaryFilters({
  items,
  className,
  showRollupsOnly,
}: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()
  const state = useScalingFilterValues()

  const hostChainOptions = uniq(
    items.map((item) => item.hostChain ?? 'Ethereum'),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const daLayerOptions = uniq(
    items
      .map(
        (item) =>
          item.dataAvailability && getDaLayerValue(item.dataAvailability.layer),
      )
      .filter(notUndefined),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const additionalFilters = (
    <>
      <TableFilter
        title="Host Chain"
        options={hostChainOptions}
        value={state.hostChain}
        onValueChange={(value) => state.set({ hostChain: value })}
      />
      <TableFilter
        title="DA Layer"
        options={daLayerOptions}
        value={state.daLayer}
        onValueChange={(value) => state.set({ daLayer: value })}
      />
    </>
  )

  return (
    <div
      className={cn(
        'flex flex-col gap-2 [@media(min-width:1400px)]:flex-row [@media(min-width:1400px)]:justify-between',
        className,
      )}
    >
      <BaseScalingFilters
        items={items}
        additionalFilters={additionalFilters}
        showRollupsOnly={showRollupsOnly}
      />
      <Checkbox
        checked={excludeAssociatedTokens}
        onCheckedChange={(checked) => setExcludeAssociatedTokens(!!checked)}
        className="max-md:ml-4"
      >
        Exclude associated tokens
      </Checkbox>
    </div>
  )
}
