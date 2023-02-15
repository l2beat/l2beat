import cx from 'classnames'
import React from 'react'
import { BulletIcon } from '../icons/symbols/BulletIcon'
import { CircleIcon } from '../icons/symbols/CircleIcon'

export interface CirclesProps {
  summary?: number[]
}

export function Circles(props: CirclesProps) {
  return (
    <div className={cx('flex text-base md:text-lg')}>
      {props.summary?.map((p, index) => (
        <CircleIcon key={index} className={`${getColor(p)}`} />
      ))}
    </div>
  )
}

function getColor(value: number) {
  switch (value) {
    case 0:
      return 'fill-red-500'
    case 1:
      return 'fill-yellow-500'
    case 2:
      return 'fill-green-700'
    default:
      return ''
  }
}
