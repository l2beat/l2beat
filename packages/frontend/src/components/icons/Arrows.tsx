import cx from 'classnames'
import React, { SVGAttributes } from 'react'

import { Icon } from './Icon'

function ArrowIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon width="10" height="5" viewBox="0 0 10 5" {...props}>
      <path d="M4.85588 0.149769C4.93456 0.0680026 5.06544 0.0680024 5.14412 0.149769L9.00424 4.16132C9.1265 4.28839 9.03645 4.5 8.86012 4.5L1.13988 4.5C0.963547 4.5 0.873499 4.28839 0.995763 4.16132L4.85588 0.149769Z" />
    </Icon>
  )
}

export function ArrowUpIcon(props: SVGAttributes<SVGElement>) {
  return (
    <ArrowIcon
      aria-label="Arrow up icon"
      alt-text="+"
      className={cx(
        'inline-block fill-green-300 dark:fill-green-450',
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
      className={cx('inline-block rotate-180 fill-red-300', props.className)}
    />
  )
}

export function ArrowRightIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      viewBox="0 0 15 14"
      width="15"
      height="14"
      aria-label="Arrow pointing to the right icon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.10329 6.29419C1.73956 6.29419 1.4447 6.60754 1.4447 6.99408C1.4447 7.38062 1.73956 7.69397 2.10329 7.69397L11.6993 7.69397L8.27358 11.3345C8.01639 11.6079 8.01639 12.051 8.27358 12.3243C8.53078 12.5977 8.94777 12.5977 9.20496 12.3243L13.7549 7.489C14.0121 7.21568 14.0121 6.77253 13.7549 6.49921L9.20496 1.66387C8.94777 1.39055 8.53078 1.39055 8.27358 1.66387C8.01639 1.9372 8.01639 2.38035 8.27358 2.65367L11.6992 6.29419L2.10329 6.29419Z"
      />
    </Icon>
  )
}
