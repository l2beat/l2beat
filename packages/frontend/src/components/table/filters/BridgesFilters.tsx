import React from 'react'

import { BridgesEntry } from '../../../pages/bridges/types'
import { FiltersWrapper } from './FiltersWrapper'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'

interface Props {
  items: BridgesEntry[]
}

export function BridgesFilters({ items }: Props) {
  return (
    <FiltersWrapper>
      <IncludeLayer2sCheckbox items={items} />
    </FiltersWrapper>
  )
}
