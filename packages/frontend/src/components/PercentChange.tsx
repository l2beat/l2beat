import classNames from 'classnames'
import React from 'react'

interface Props {
  value: string
}

export function PercentChange({ value }: Props) {
  const className = classNames(
    'PercentChange',
    value.startsWith('+') ? 'up' : 'down',
  )
  return <span className={className}>{value}</span>
}
