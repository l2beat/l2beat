import uniq from 'lodash/uniq'
import React from 'react'

import { BridgesEntry } from '../../../pages/bridges/types'
import { OverflowWrapper } from '../../OverflowWrapper'
import { RichSelect } from '../../RichSelect'
import { FiltersWrapper, generateSlugList } from './FiltersWrapper'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'

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

  return (
    <OverflowWrapper>
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
      </FiltersWrapper>
    </OverflowWrapper>
  )
}
