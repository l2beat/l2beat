import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling/activity/view/types'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper } from './FiltersWrapper'

interface Props {
  items: ActivityViewEntry[]
}

export function ScalingActivityFilters({ items }: Props) {
  return (
    <FiltersWrapper items={items}>
      <RollupsOnlyCheckbox items={items} />
    </FiltersWrapper>
  )
}
