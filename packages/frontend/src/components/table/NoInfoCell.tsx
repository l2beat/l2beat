import React from 'react'

import { Tooltip } from '../tooltip/Tooltip'

export function NoInfoCell() {
  return (
    <Tooltip
      className="text-gray-550 dark:text-gray-500"
      content="This item is still under review."
    >
      No info
    </Tooltip>
  )
}
