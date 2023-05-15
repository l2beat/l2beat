import React from 'react'

import { Checkbox } from '../../../Checkbox'

export interface IncludeLayer2sCheckboxProps {
  className?: string
}

export function IncludeLayer2sCheckbox({
  className,
}: IncludeLayer2sCheckboxProps) {
  return (
    <Checkbox
      className={className}
      role="chart-combined"
      id="combined-bridges-checkbox"
      label="Include canonical bridges to Layer2s"
    />
  )
}
