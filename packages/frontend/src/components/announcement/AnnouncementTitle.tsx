import cx from 'classnames'
import React, { ReactNode } from 'react'

export function AnnouncementTitle({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'font-semibold',
        'leading-tight',
        'tracking-normal',
        className,
      )}
    >
      {children}
    </div>
  )
}
