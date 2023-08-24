import React from 'react'

import { Checkbox } from '../../../Checkbox'

export interface RollupsOnlyCheckboxProps {
  className?: string
}

export function RollupsOnlyCheckbox({ className }: RollupsOnlyCheckboxProps) {
  return (
    <Checkbox
      className={className}
      role="chart-rollups-only"
      id="rollups-only-checkbox"
      label="Show rollups only"
    />
  )
}
