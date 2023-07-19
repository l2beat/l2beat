import cx from 'classnames'
import React, { ReactNode } from 'react'

export function AnnouncementNotation({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return <div className={cx('uppercase', className)}>{children}</div>
}
