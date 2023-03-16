import cx from 'classnames'
import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from './icons/Arrows'

interface Props {
  value: string
  className?: string
}

export function PercentChange({ value, className }: Props) {
  const isMore = value.startsWith('+')
  const isLess = value.startsWith('-')

  return (
    <span
      className={cx(
        isMore && 'text-green-300 dark:text-green-450',
        isLess && 'text-red-300',
        'relative',
        className,
      )}
    >
      {isMore && (
        <ArrowUpIcon className="absolute top-1/2 translate-y-[-50%]" />
      )}
      {isLess && (
        <ArrowDownIcon className="absolute top-1/2 translate-y-[-50%]" />
      )}
      <span className="relative pl-3.5">{value.substring(1)}</span>
    </span>
  )
}
