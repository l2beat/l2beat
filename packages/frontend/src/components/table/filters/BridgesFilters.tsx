import React from 'react'

import { BridgesEntry } from '../../../pages/bridges/types'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'
import { FiltersWrapper } from './FiltersWrapper'

interface Props {
  items: BridgesEntry[]
}

export function BridgesFilters({ items }: Props) {
  return (
    <FiltersWrapper items={items}>
      <IncludeLayer2sCheckbox items={items} />
    </FiltersWrapper>
  )
}
