import React from 'react'

import { Checkbox } from '../../../Checkbox'

export function ExcludeAssociatedTokensCheckbox() {
  return (
    <Checkbox
      className="w-max"
      role="chart-exclude-associated-tokens"
      id="exclude-associated-tokens-checkbox"
      label="Exclude associated tokens"
    />
  )
}
