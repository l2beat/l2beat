import cx from 'classnames'
import React from 'react'

import { Icon } from '../icons/Icon'

export interface CirclesProps {
  summary?: number[]
}

export function Circles(props: CirclesProps) {
  return (
    <div className={cx('flex text-base md:text-lg')}>
      {props.summary
        ?.sort()
        .reverse()
        .map((p, index) => getColor(p, index))}
    </div>
  )
}

function getColor(value: number, index: number) {
  switch (value) {
    case 0:
      return (
        <Icon
          viewBox="0 0 20 20"
          width="16"
          height="20"
          aria-label="Bullet point icon"
          className="fill-red-500"
        >
          <circle cx="10" cy="10" r="7" />
        </Icon>
      )
    case 1:
      return (
        <Icon
          viewBox="0 0 20 20"
          width="16"
          height="20"
          aria-label="Bullet point icon"
          className="fill-yellow-500"
        >
          <circle cx="10" cy="10" r="8" />
        </Icon>
      )
    case 2:
      return (
        <Icon
          viewBox="0 0 20 20"
          width="16"
          height="20"
          aria-label="Bullet point icon"
          className="fill-green-700"
        >
          <circle cx="10" cy="10" r="9" />
        </Icon>
      )
    default:
      return ''
  }
}
