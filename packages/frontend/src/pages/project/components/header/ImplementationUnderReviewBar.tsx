import React from 'react'

import { UnderReviewIcon } from '../../../../components/icons'

export function ImplementationUnderReviewBar() {
  return (
    <div className="flex w-full justify-center rounded-lg bg-yellow-700/20 px-2 py-2.5">
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
