import uniq from 'lodash/uniq'
import React from 'react'

import { ScalingRiskViewEntry } from '../../../pages/scaling/risk/view/types'
import { RichSelect } from '../../RichSelect'
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
      <RichSelect label="Select DA" id="DA-select">
        {dataAvailability.map((da) => (
          <RichSelect.Item
            selectedLabel={da.label}
            key={da.label}
            value={JSON.stringify(da.value)}
          >
            {da.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
    </FiltersWrapper>
  )
}
