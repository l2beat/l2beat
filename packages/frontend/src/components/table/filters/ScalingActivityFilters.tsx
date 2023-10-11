import uniq from 'lodash/uniq'
import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling/activity/view/types'
import { RichSelect } from '../../RichSelect'
import { RollupsOnlyCheckbox } from './checkboxes/RollupsOnlyCheckbox'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'

interface Props {
  items: ActivityViewEntry[]
}

export function ScalingActivityFilters({ items }: Props) {
  const itemsWithoutEthereum = items.filter((i) => i.slug !== 'ethereum')
  const providers = uniq(itemsWithoutEthereum.map((i) => i.provider))
    .sort()
    .map((p) => ({
      label: p ?? 'No provider',
      value: generateSlugList(itemsWithoutEthereum, (i) => i.provider === p),
    }))

  return (
    <FiltersWrapper items={itemsWithoutEthereum}>
      <RollupsOnlyCheckbox items={itemsWithoutEthereum} />
      <RichSelect label="Select stack" id="stack-select">
        {providers.map((da) => (
          <RichSelect.Item
            selectedLabel={da.label}
            key={da.label}
            value={da.value}
          >
            {da.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
    </FiltersWrapper>
  )
}
