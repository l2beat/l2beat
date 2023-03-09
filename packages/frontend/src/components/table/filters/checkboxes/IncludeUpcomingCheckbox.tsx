import React from 'react'

import { Checkbox } from '../../../Checkbox'

export interface IncludeUpcomingCheckboxProps {
  className?: string
}

export function IncludeUpcomingCheckbox({
  className,
}: IncludeUpcomingCheckboxProps) {
  return (
    <Checkbox
      className={className}
      role="table-upcoming"
      id="upcoming-rollups"
      label="Show upcoming rollups"
    />
  )
}
