import React from 'react'

import { ScalingDetailedTvlViewEntry } from '../../../pages/scaling-detailedTvl/types'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper } from './FiltersWrapper'

interface Props {
  items: ScalingDetailedTvlViewEntry[]
}

export function ScalingDetailedTvlFilters({ items }: Props) {
  return (
    <FiltersWrapper items={items}>
      <RollupsOnlyCheckbox items={items} />
    </FiltersWrapper>
  )
}
