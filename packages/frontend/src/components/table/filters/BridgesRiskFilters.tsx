import React from 'react'

import { BridgesRiskViewEntry } from '../../../pages/bridges/risk/types'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'
import { FiltersWrapper } from './FiltersWrapper'

interface Props {
  items: BridgesRiskViewEntry[]
}

export function BridgesRiskFilters({ items }: Props) {
  return (
    <FiltersWrapper items={items}>
      <IncludeLayer2sCheckbox items={items} />
    </FiltersWrapper>
  )
}
