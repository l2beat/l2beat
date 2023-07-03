import React from 'react'

import { UnderReviewIcon } from '../icons'

export function UnderReviewCallout() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-yellow-700/20 p-8">
      <div>
        <UnderReviewIcon className="relative -top-0.5 inline-block h-6 w-6" />
        <span className="ml-2 inline-block text-2xl font-medium">
          Project Under Review
        </span>
      </div>
      <p className="text-center text-sm">
        Projects under review might present uncompleted information & data.
        <br />
        L2BEAT Team is working to research & validate content before publishing.
      </p>
    </div>
  )
}
