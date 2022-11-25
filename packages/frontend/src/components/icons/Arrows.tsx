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

export function ArrowRightIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-label="Arrow pointing to the right icon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.41078 7.29416C2.04706 7.29416 1.7522 7.60751 1.7522 7.99405C1.7522 8.38059 2.04706 8.69394 2.41078 8.69394L12.0068 8.69394L8.58108 12.3345C8.32388 12.6078 8.32388 13.051 8.58108 13.3243C8.83827 13.5976 9.25527 13.5976 9.51246 13.3243L14.0624 8.48897C14.3196 8.21565 14.3196 7.7725 14.0624 7.49918L9.51246 2.66384C9.25527 2.39052 8.83827 2.39052 8.58108 2.66384C8.32389 2.93717 8.32389 3.38031 8.58108 3.65364L12.0067 7.29416L2.41078 7.29416Z"
      />
    </Icon>
  )
}
