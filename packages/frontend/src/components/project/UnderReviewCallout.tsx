import React from 'react'

import { cn } from '../../utils/cn'
import { UnderReviewIcon } from '../icons'

export function UnderReviewCallout({
  small,
  className,
}: {
  small?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg bg-yellow-700/20',
        small ? 'gap-2 p-4' : 'items-center gap-4 p-8 ',
        className,
      )}
    >
      <div>
        <UnderReviewIcon
          className={cn(
            'relative -top-0.5 inline-block',
            small ? 'size-4' : ' size-6',
          )}
        />
        <span
          className={cn('ml-2 inline-block font-medium', !small && 'text-2xl')}
        >
          Project Under Review
        </span>
      </div>
      {small ? (
        <p className="text-balance text-sm">
          Projects under review might present incomplete info & data.
        </p>
      ) : (
        <p className="text-balance text-center text-sm">
          Projects under review might present incomplete information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      )}
    </div>
  )
}
