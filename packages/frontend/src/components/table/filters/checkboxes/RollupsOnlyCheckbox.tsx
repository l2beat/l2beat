import React from 'react'

import { ScalingEntry } from '../../../../pages/scaling/types'
import { Checkbox } from '../../../Checkbox'
import { generateSlugList } from '../FiltersWrapper'

export interface RollupsOnlyCheckboxProps<T extends ScalingEntry> {
  items: T[]
  className?: string
}

export function RollupsOnlyCheckbox<T extends ScalingEntry>({
  className,
  items,
}: RollupsOnlyCheckboxProps<T>) {
  return (
    <Checkbox
      className={className}
      role="chart-rollups-only"
      id="rollups-only-checkbox"
      label="Show rollups only"
      slugsWhenChecked={generateSlugList(
        items,
        (i) => i.category === 'Optimistic Rollup' || i.category === 'ZK Rollup',
      )}
    />
  )
}
