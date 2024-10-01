import { uniq } from 'lodash'
import { Checkbox } from '~/components/core/checkbox'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { BaseScalingFilters } from './base-scaling-filters'
import { useScalingAssociatedTokensContext } from './scaling-associated-tokens-context'
import { useScalingFilterValues } from './scaling-filter-context'
import { cn } from '~/utils/cn'

interface Props {
  items: CommonScalingEntry[]
  className?: string
}

export function ScalingTvlFilters({ items, className }: Props) {
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

  const hostChainFilter = (
    <TableFilter
      title="Host Chain"
      options={hostChainOptions}
      value={state.hostChain}
      onValueChange={(value) => state.set({ hostChain: value })}
    />
  )

  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-x-4 gap-y-2 lg:flex-row lg:justify-between',
        className,
      )}
    >
      <BaseScalingFilters
        items={items}
        additionalFilters={hostChainFilter}
        showRollupsOnly
      />
      <Checkbox
        id="exclude-associated-tokens"
        checked={excludeAssociatedTokens}
        onCheckedChange={(checked) => setExcludeAssociatedTokens(!!checked)}
      >
        Exclude associated tokens
      </Checkbox>
    </div>
  )
}
