import uniq from 'lodash/uniq'
import React from 'react'

import { BridgesEntry } from '../../../pages/bridges/types'
import { RichSelect } from '../../RichSelect'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'

interface Props {
  items: BridgesEntry[]
}

export function BridgesFilters({ items }: Props) {
  const validatedBy = uniq(items.map((i) => i.validatedBy?.value))
    .sort()
    .map((p) => ({
      label: p ?? 'No Validated By',
      value: generateSlugList(items, (i) => i.validatedBy?.value === p),
    }))
  const types = uniq(items.map((i) => i.category))
    .sort()
    .map((p) => ({
      label: p ?? 'No type',
      value: generateSlugList(items, (i) => i.category === p),
    }))
  const destinations = uniq(items.map((i) => i.destination?.value))
    .sort()
    .map((p) => ({
      label: p ?? 'No type',
      value: generateSlugList(items, (i) => i.destination?.value === p),
    }))

  return (
    <FiltersWrapper>
      <IncludeLayer2sCheckbox items={items} />
      <RichSelect label="Validated By" id="validatedBy-select">
        {validatedBy.map((vb) => (
          <RichSelect.Item
            selectedLabel={vb.label}
            key={vb.label}
            value={vb.value}
          >
            {vb.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
      <RichSelect label="Type" id="type-select">
        {types.map((type) => (
          <RichSelect.Item
            selectedLabel={type.label}
            key={type.label}
            value={type.value}
          >
            {type.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
      <RichSelect label="Destination" id="destination-select">
        {destinations.map((destination) => (
          <RichSelect.Item
            selectedLabel={destination.label}
            key={destination.label}
            value={destination.value}
          >
            {destination.label}
          </RichSelect.Item>
        ))}
      </RichSelect>
    </FiltersWrapper>
  )
}
