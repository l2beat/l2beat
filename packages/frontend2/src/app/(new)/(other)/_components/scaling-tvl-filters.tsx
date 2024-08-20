import { Checkbox } from '~/app/_components/checkbox'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { BaseScalingFilters } from './base-scaling-filters'
import { useScalingAssociatedTokensContext } from './scaling-associated-tokens-context'

interface Props {
  items: CommonScalingEntry[]
}

export function ScalingTvlFilters({ items }: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  return (
    <div className="flex flex-col-reverse gap-x-4 gap-y-2 lg:flex-row">
      <BaseScalingFilters items={items} showRollupsOnly />
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
