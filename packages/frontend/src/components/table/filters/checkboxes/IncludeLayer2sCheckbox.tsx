import React from 'react'

import { BridgesEntry } from '../../../../pages/bridges/types'
import { Checkbox } from '../../../Checkbox'
import { generateSlugList } from '../FiltersWrapper'

export interface IncludeLayer2sCheckboxProps {
  className?: string
  items: BridgesEntry[]
}

export function IncludeLayer2sCheckbox({
  className,
  items,
}: IncludeLayer2sCheckboxProps) {
  return (
    <Checkbox
      className={className}
      role="chart-combined"
      id="combined-bridges-checkbox"
      label="Include canonical bridges"
      slugsWhenUnchecked={generateSlugList(items, (i) => i.type === 'bridge')}
    />
  )
}
