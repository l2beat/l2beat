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
        'col-span-4 col-start-1 flex justify-center text-center text-sm sm:col-span-2 sm:col-start-2',
        hidden && 'hidden',
      )}
    >
      ...
    </p>
  )
}
