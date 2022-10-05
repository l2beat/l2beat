import cx from 'classnames'
import React from 'react'

export interface DescriptionProps {
  hidden: boolean
}

export function Description({ hidden }: DescriptionProps) {
  return (
    <p
      data-role="chart-description"
      className={cx(
        'col-start-1 sm:col-start-2 col-span-4 sm:col-span-2 text-center text-sm flex justify-center',
        hidden && 'hidden',
      )}
    >
      ...
    </p>
  )
}
