import React from 'react'

import { Checkbox } from '../../../Checkbox'
import { cn } from '../../../../utils/cn'

export function ExcludeAssociatedTokensCheckbox({
  className,
}: { className?: string }) {
  return (
    <Checkbox
      className={cn('w-max', className)}
      role="chart-exclude-associated-tokens"
      id="exclude-associated-tokens-checkbox"
      label="Exclude associated tokens"
    />
  )
}
