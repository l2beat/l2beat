'use client'
import { Checkbox } from '~/components/core/checkbox'
import type { FilterableScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { cn } from '~/utils/cn'
import { useScalingAssociatedTokensContext } from './scaling-associated-tokens-context'
import { ScalingFilters } from './scaling-filters'

interface Props {
  items: FilterableScalingEntry[]
  className?: string
}

export function ScalingSummaryFilters({ items, className }: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  return (
    <div
      className={cn(
        'flex flex-col gap-2 [@media(min-width:1400px)]:flex-row [@media(min-width:1400px)]:justify-between',
        className,
      )}
    >
      <ScalingFilters items={items} showHostChainFilter showDALayerFilter />
      <Checkbox
        name="excludeAssociatedTokens"
        checked={excludeAssociatedTokens}
        onCheckedChange={(checked) => setExcludeAssociatedTokens(!!checked)}
        className="max-md:ml-4"
      >
        Exclude associated tokens
      </Checkbox>
    </div>
  )
}
