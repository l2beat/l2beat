import classNames from 'classnames'
import React from 'react'

import { ArrowRightIcon } from './icons'

type LinkProps = React.HTMLProps<HTMLAnchorElement> & {
  type?: LinkType
  showArrow?: boolean
}

type LinkType = 'primary' | 'danger' | 'plain'

const textClassesByType: Record<LinkType, string> = {
  primary: 'text-blue-700 hover:text-blue-550 dark:text-blue-500',
  danger: 'text-red-300 hover:text-red-700',
  plain: 'text-black dark:text-white',
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
          textClassesByType[type],
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
