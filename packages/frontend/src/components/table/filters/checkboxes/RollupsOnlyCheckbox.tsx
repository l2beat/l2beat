import React from 'react'

import { ScalingTvlViewEntry } from '../../../../pages/scaling-tvl/types'
import { Checkbox } from '../../../Checkbox'

export interface RollupsOnlyCheckboxProps {
  items: ScalingTvlViewEntry[]
  className?: string
}

export function RollupsOnlyCheckbox({
  className,
  items,
}: RollupsOnlyCheckboxProps) {
  return (
    <Checkbox
      className={className}
      role="chart-rollups-only"
      id="rollups-only-checkbox"
      label="Show rollups only"
      slugs={items.map((i) => {
        if (i.category === 'Optimistic Rollup' || i.category === 'ZK Rollup') {
          return i.slug
        }
        return ''
      })}
    />
  )
}
