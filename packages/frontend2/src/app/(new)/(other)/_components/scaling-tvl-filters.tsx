import { Checkbox } from '~/app/_components/checkbox'
import { type CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { BaseScalingFilters } from './base-scaling-filters'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: CommonScalingEntry[]
}

export function ScalingTvlFilters({ items }: Props) {
  const state = useScalingFilterValues()

  const excludeAssociatedCheckbox = (
    <Checkbox
      id="exclude-associated-tokens"
      onCheckedChange={(checked) =>
        state.set({ excludeAssociatedTokens: !!checked })
      }
    >
      Exclude associated tokens
    </Checkbox>
  )

  return (
    <BaseScalingFilters
      items={items}
      additionalFiltersRight={excludeAssociatedCheckbox}
      showRollupsOnly
    />
  )
}
