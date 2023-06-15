import classNames from 'classnames'
import React from 'react'

import { ArrowRightIcon } from './icons'

type LinkProps = React.HTMLProps<HTMLAnchorElement> & {
  type?: 'primary' | 'danger'
  showArrow?: boolean
}

export function Link({
  type = 'primary',
  className,
  href,
  children,
  showArrow,
  ...rest
}: LinkProps) {
  const isOutLink = /^https?:\/\//.test(href ?? '')
  const target = isOutLink ? '_blank' : undefined
  const rel = isOutLink ? 'noreferrer noopener' : undefined

  return (
    <a
      href={href}
      className={classNames('group', className)}
      target={target}
      rel={rel}
      {...rest}
    >
      <span
        className={classNames(
          'inline-flex items-center font-semibold transition-colors',
          type === 'primary' &&
            'text-blue-700 group-hover:text-blue-550 dark:text-blue-500',
          type === 'danger' && 'text-red-300 group-hover:text-red-700',
        )}
      >
        <span
          className={classNames(
            'flex items-center gap-1 underline',
            showArrow && 'transition-transform group-hover:-translate-x-px',
          )}
        >
          {children}
        </span>
        {showArrow && (
          <ArrowRightIcon className="ml-1 inline-block fill-current transition-transform group-hover:translate-x-px group-hover:fill-blue-550 dark:fill-blue-500" />
        )}
      </span>
    </a>
  )
}
