import React from 'react'

import { Checkbox } from '../../../Checkbox'

export interface IncludeArchivedCheckboxProps {
  className?: string
}

export function IncludeArchivedCheckbox({
  className,
}: IncludeArchivedCheckboxProps) {
  return (
    <Checkbox
      className={className}
      role="table-archived"
      id="archived-projects"
      label="Show archived projects"
    />
  )
}
