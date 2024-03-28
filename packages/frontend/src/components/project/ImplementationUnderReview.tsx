import React from 'react'

import { cn } from '../../utils/cn'
import { UnderReviewIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export function ImplementationUnderReview({
  className,
}: {
  className?: string
}) {
  return (
    <Tooltip className={cn('inline-block', className)}>
      <TooltipTrigger>
        <UnderReviewIcon className="size-4 md:size-6" />
      </TooltipTrigger>
      <TooltipContent>
        There are implementation changes and part of the information might be
        outdated.
      </TooltipContent>
    </Tooltip>
  )
}
