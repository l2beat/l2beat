import React from 'react'

import { cn } from '../../../../utils/cn'
import { Checkbox } from '../../../Checkbox'

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
