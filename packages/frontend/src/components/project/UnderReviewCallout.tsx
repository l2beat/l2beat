import cx from 'classnames'
import React from 'react'

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
      className={cx(
        'flex flex-col rounded-lg bg-yellow-700/20',
        small ? 'gap-2 p-4' : 'items-center gap-4 p-8 ',
        className,
      )}
    >
      <div>
        <UnderReviewIcon
          className={cx(
            'relative -top-0.5 inline-block',
            small ? 'h-4 w-4' : ' h-6 w-6',
          )}
        />
        <span
          className={cx(
            'ml-2 inline-block font-medium',
            small ? 'text-md' : 'text-2xl',
          )}
        >
          Project Under Review
        </span>
      </div>
      {small ? (
        <p className="text-sm">
          Projects under review might present incomplete info & data.
        </p>
      ) : (
        <p className={cx('text-center text-sm')}>
          Projects under review might present incomplete information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      )}
    </div>
  )
}
