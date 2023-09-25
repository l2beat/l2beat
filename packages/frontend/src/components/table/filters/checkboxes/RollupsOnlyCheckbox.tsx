import React from 'react'

import { ActivityViewEntry } from '../../../../pages/scaling-activity/view/types'
import { ScalingDetailedTvlViewEntry } from '../../../../pages/scaling-detailedTvl/types'
import { ScalingRiskViewEntry } from '../../../../pages/scaling-risk/view/types'
import { ScalingTvlViewEntry } from '../../../../pages/scaling-tvl/types'
import { Checkbox } from '../../../Checkbox'
import { generateSlugList } from '../FiltersWrapper'

export interface RollupsOnlyCheckboxProps<
  T extends
    | ScalingTvlViewEntry
    | ScalingRiskViewEntry
    | ActivityViewEntry
    | ScalingDetailedTvlViewEntry,
> {
  items: T[]
  className?: string
}

export function RollupsOnlyCheckbox<
  T extends
    | ScalingTvlViewEntry
    | ScalingRiskViewEntry
    | ActivityViewEntry
    | ScalingDetailedTvlViewEntry,
>({ className, items }: RollupsOnlyCheckboxProps<T>) {
  return (
    <Checkbox
      className={className}
      role="chart-rollups-only"
      id="rollups-only-checkbox"
      label="Show rollups only"
      slugs={generateSlugList(
        items,
        (i) => i.category === 'Optimistic Rollup' || i.category === 'ZK Rollup',
      )}
    />
  )
}
