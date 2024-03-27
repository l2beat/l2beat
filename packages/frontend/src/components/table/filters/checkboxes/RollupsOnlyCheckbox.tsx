import React from 'react'

import { ScalingFiltersEntry } from '../../../../pages/scaling/types'
import { Checkbox } from '../../../Checkbox'
import { generateSlugList } from '../FiltersWrapper'

export interface RollupsOnlyCheckboxProps<T extends ScalingFiltersEntry> {
  items: T[]
  className?: string
}

export function RollupsOnlyCheckbox<T extends ScalingFiltersEntry>({
  className,
  items,
}: RollupsOnlyCheckboxProps<T>) {
  return (
    <Checkbox
      className={className}
      role="chart-rollups-only"
      id="rollups-only-checkbox"
      label="Rollups only"
      data-slugs-when-checked={generateSlugList(
        items,
        (i) => i.category === 'Optimistic Rollup' || i.category === 'ZK Rollup',
      )}
    />
  )
}
