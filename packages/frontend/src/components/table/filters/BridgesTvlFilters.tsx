import React from 'react'

import { BridgesTvlViewEntry } from '../../../pages/bridges/tvl/types'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'
import { FiltersWrapper } from './FiltersWrapper'

interface Props {
  items: BridgesTvlViewEntry[]
}

export function BridgesTvlFilters({ items }: Props) {
  return (
    <FiltersWrapper items={items}>
      <IncludeLayer2sCheckbox items={items} />
    </FiltersWrapper>
  )
}
