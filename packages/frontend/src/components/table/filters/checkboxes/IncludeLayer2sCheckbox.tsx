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
      label="Canonical bridges"
      data-slugs-when-unchecked={generateSlugList(
        items,
        (i) => i.type === 'bridge',
      )}
    />
  )
}
