import cx from 'classnames'
import React from 'react'

interface Props {
  value: string
}

export function PercentChange({ value }: Props) {
  return (
    <span
      className={cx(
        value.startsWith('+') && 'text-green-700 dark:text-green-300',
        value.startsWith('-') && 'text-red-700 dark:text-red-300',
      )}
    >
      {value}
    </span>
  )
}
