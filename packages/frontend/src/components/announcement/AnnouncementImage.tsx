import cx from 'classnames'
import React from 'react'

export function AnnouncementImage({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return <img className={cx(className)} src={src} />
}
