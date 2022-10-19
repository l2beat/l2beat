import cx from 'classnames'
import React, { SVGAttributes } from 'react'

import { Icon } from './Icon'

export function ArrowUpIcon(props: SVGAttributes<SVGElement>) {
  return (
    <ArrowIcon
      aria-label="Arrow up icon"
      alt-text="+"
      className={cx(
        'inline-block fill-green-700 dark:fill-green-300',
        props.className,
      )}
    />
  )
}

export function ArrowDownIcon(props: SVGAttributes<SVGElement>) {
  return (
    <ArrowIcon
      aria-label="Arrow down icon"
      alt-text="-"
      className={cx(
        'rotate-180 inline-block fill-red-700 dark:fill-red-300',
        props.className,
      )}
    />
  )
}

function ArrowIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon width="10" height="5" viewBox="0 0 10 5" {...props}>
      <path d="M4.85588 0.149769C4.93456 0.0680026 5.06544 0.0680024 5.14412 0.149769L9.00424 4.16132C9.1265 4.28839 9.03645 4.5 8.86012 4.5L1.13988 4.5C0.963547 4.5 0.873499 4.28839 0.995763 4.16132L4.85588 0.149769Z" />
    </Icon>
  )
}
