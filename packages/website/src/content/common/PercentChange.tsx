import cx from 'classnames'
import React from 'react'

interface Props {
  value: string
}

export function PercentChange({ value }: Props) {
  const className = cx('PercentChange', value.startsWith('+') ? 'up' : 'down')
  return <span className={className}>{value}</span>
}
