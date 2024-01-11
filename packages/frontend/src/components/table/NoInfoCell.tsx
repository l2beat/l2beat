import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export function NoInfoCell() {
  return (
    <Tooltip>
      <TooltipTrigger className="text-gray-550 dark:text-gray-500">
        No info
      </TooltipTrigger>
      <TooltipContent>This item is still under review.</TooltipContent>
    </Tooltip>
  )
}
