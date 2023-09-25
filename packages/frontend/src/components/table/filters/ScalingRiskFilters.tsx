import { uniq } from 'lodash'
import React from 'react'

import { ScalingRiskViewEntry } from '../../../pages/scaling-risk/view/types'
import { Select } from '../../Select'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'

interface Props {
  items: ScalingRiskViewEntry[]
}

export function ScalingRiskFilters({ items }: Props) {
  const dataAvailability = uniq(
    items.map((i) => {
      if (i.dataAvailability.value === '') {
        console.log(i)
      }
      return i.dataAvailability.value
    }),
  )
    .sort()
    .map((val) => ({
      label: val,
      value: generateSlugList(items, (i) => i.dataAvailability.value === val),
    }))

  return (
    <FiltersWrapper items={items}>
      <RollupsOnlyCheckbox items={items} />
      <Select label="Select DA" items={dataAvailability} id="DA-select" />
    </FiltersWrapper>
  )
}
