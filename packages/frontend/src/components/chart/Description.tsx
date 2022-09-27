import classNames from 'classnames'
import React from 'react'

export interface DescriptionProps {
  hidden: boolean
}

export function Description({ hidden }: DescriptionProps) {
  return (
    <p
      data-role="chart-description"
<<<<<<< HEAD
      className={classNames(
        'col-start-1 sm:col-start-2 col-span-4 sm:col-span-2 text-center text-sm flex justify-center',
        hidden && 'hidden',
      )}
=======
      className="col-start-1 sm:col-start-2 col-span-4 sm:col-span-2 text-center text-sm flex justify-center"
      style={hidden ? { display: 'none' } : {}}
>>>>>>> 6d32d83f (hide part of chart UI)
    >
      ...
    </p>
  )
}
