import cx from 'classnames'
import React from 'react'

import { InfoIcon } from '../icons'

export function StageDisclaimer({
  text,
  small,
  className,
}: {
  text: string
  small?: boolean
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex bg-blue-700/20 p-4 font-medium',
        small ? 'gap-2 rounded-[4px] text-sm' : 'gap-3 rounded-lg',
        className,
      )}
    >
      <InfoIcon className={cx('shrink-0 fill-blue-500', !small && 'h-5 w-5')} />
      <span>{text}</span>
    </div>
  )
}
