import cx from 'classnames'
import React, { ReactNode } from 'react'

export function AnnouncementButtonLink({
  href,
  children,
  className,
}: {
  href: string
  children?: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={cx(
        'text-white',
        'rounded-md',
        'bg-pink-900',
        'py-3.5',
        'w-full',
        'md:w-40',
        'font-medium',
        'text-center',
        className,
      )}
    >
      {children}
    </a>
  )
}
