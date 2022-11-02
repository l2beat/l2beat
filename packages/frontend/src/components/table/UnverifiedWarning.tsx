import React from 'react'
import cx from 'classnames'
import { InfoIcon } from '../icons'

export interface UnverifiedWarningProps {
  message: string
  className: string
}

export function UnverifiedWarning({ message, className}: UnverifiedWarningProps) {
  return (
    <span className={cx("Tooltip inline-block", className)} title={message}>
      <InfoIcon width="16" height="16" viewBox="0 0 16 16" className='fill-red-300 dark:fill-red-700' />
    </span>
  )
}
