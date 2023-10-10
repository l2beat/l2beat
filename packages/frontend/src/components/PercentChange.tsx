import cx from 'classnames'
import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from './icons/Arrows'

interface Props {
  value: string
  role?: string
  className?: string
}

/*  IMPORTANT
  If you change this file you need to update the following file too:
  * packages/frontend/src/scripts/charts/view-controller/header/getChangeHtml.ts
*/
export function PercentChange({ value, className, role }: Props) {
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
      data-role={role}
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
