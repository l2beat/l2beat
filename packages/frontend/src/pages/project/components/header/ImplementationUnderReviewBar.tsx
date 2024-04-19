import React from 'react'

import { UnderReviewIcon } from '../../../../components/icons'
import { cn } from '../../../../utils/cn'

export function ImplementationUnderReviewBar({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex w-full justify-center px-2 py-2.5',
        'rounded-lg bg-yellow-700/20',
        className,
      )}
    >
      <span className="flex flex-row">
        <span className="flex items-center">
          <UnderReviewIcon />
        </span>
        <span className="ml-2 text-pretty text-base font-medium">
          There are implementation changes and part of the information might be
          outdated.
        </span>
      </span>
    </div>
  )
}
