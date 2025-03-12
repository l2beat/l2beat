'use client'
import { Checkbox } from '~/components/core/checkbox'
import { NewTableFilters } from '~/components/table/filters/new-table-filters'
import type { FilterableScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { cn } from '~/utils/cn'
import { useScalingAssociatedTokensContext } from './scaling-associated-tokens-context'

interface Props {
  entries: FilterableScalingEntry[]
  className?: string
}

export function ScalingSummaryFilters({ entries, className }: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  return (
    <div
      className={cn(
        'flex flex-col gap-2 [@media(min-width:1400px)]:flex-row [@media(min-width:1400px)]:justify-between',
        className,
      )}
    >
      <NewTableFilters entries={entries} />
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
